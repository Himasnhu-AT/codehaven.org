use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use std::time::SystemTime;
use std::{
    fs,
    io::{self, Read, Write},
    path::Path,
};
use tauri::{command, State};
use tokio::sync::Mutex;

// Cache structure to store recently accessed files
struct FileCache {
    contents: HashMap<String, (String, SystemTime)>,
}

impl FileCache {
    fn new() -> Self {
        Self {
            contents: HashMap::new(),
        }
    }

    fn get(&self, path: &str) -> Option<&String> {
        if let Some((content, timestamp)) = self.contents.get(path) {
            // Check if cache is still valid (less than 5 seconds old)
            if SystemTime::now()
                .duration_since(*timestamp)
                .unwrap()
                .as_secs()
                < 5
            {
                return Some(content);
            }
        }
        None
    }

    fn set(&mut self, path: String, content: String) {
        self.contents.insert(path, (content, SystemTime::now()));
    }
}

// Define custom error type
#[derive(Debug, Serialize)]
struct AppError {
    message: String,
    error_type: String,
}

impl From<io::Error> for AppError {
    fn from(error: io::Error) -> Self {
        AppError {
            message: error.to_string(),
            error_type: "io".to_string(),
        }
    }
}

impl From<String> for AppError {
    fn from(error: String) -> Self {
        AppError {
            message: error,
            error_type: "custom".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct FileTreeNode {
    name: String,
    path: String,
    #[serde(rename = "type")]
    node_type: String,
    children: Option<Vec<FileTreeNode>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    size: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    modified: Option<String>,
}

const CHUNK_SIZE: usize = 1024 * 1024; // 1MB chunks for large files
const MAX_PARALLEL_DIRS: usize = 50; // Maximum number of directories to process in parallel

// Changed to sync function for use with rayon
fn read_dir_recursive_inner<P: AsRef<Path>>(
    path: P,
    depth: usize,
    max_depth: usize,
) -> Result<FileTreeNode, AppError> {
    let path = path.as_ref().to_path_buf();
    let metadata = fs::metadata(&path)?;

    let name = path
        .file_name()
        .ok_or_else(|| AppError::from("Invalid path".to_string()))?
        .to_string_lossy()
        .into_owned();

    let node_type = if metadata.is_dir() {
        "directory"
    } else {
        "file"
    };
    let size = if metadata.is_file() {
        Some(metadata.len())
    } else {
        None
    };
    let modified = metadata.modified().ok().map(|time| {
        time.duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_secs()
            .to_string()
    });

    let children = if metadata.is_dir() && depth < max_depth {
        let entries: Vec<_> = fs::read_dir(&path)?
            .filter_map(|entry| entry.ok())
            .collect();

        if entries.len() > 10 && entries.len() < MAX_PARALLEL_DIRS {
            // Process larger directories in parallel using rayon
            Some(
                entries
                    .par_iter()
                    .map(|entry| read_dir_recursive_inner(entry.path(), depth + 1, max_depth))
                    .collect::<Result<Vec<_>, _>>()?,
            )
        } else {
            // Process sequentially for small directories or very large directories
            Some(
                entries
                    .iter()
                    .map(|entry| read_dir_recursive_inner(entry.path(), depth + 1, max_depth))
                    .collect::<Result<Vec<_>, _>>()?,
            )
        }
    } else {
        None
    };

    Ok(FileTreeNode {
        name,
        path: path.to_string_lossy().to_string(),
        node_type: node_type.to_string(),
        children,
        size,
        modified,
    })
}

// Async wrapper for the sync function
#[command]
async fn get_file_tree(path: String, max_depth: Option<usize>) -> Result<FileTreeNode, AppError> {
    // Spawn blocking operation to handle file system operations
    tokio::task::spawn_blocking(move || {
        read_dir_recursive_inner(path, 0, max_depth.unwrap_or(std::usize::MAX))
    })
    .await
    .map_err(|e| AppError::from(e.to_string()))?
}

#[command]
async fn get_file_content(
    path: String,
    cache: State<'_, Arc<Mutex<FileCache>>>,
) -> Result<String, AppError> {
    // First, check the cache
    {
        let cache_guard = cache.lock().await;
        if let Some(content) = cache_guard.get(&path) {
            return Ok(content.clone());
        }
    }

    // If not in cache, read from file using spawn_blocking
    let path_clone = path.clone();
    let content = tokio::task::spawn_blocking(move || {
        let mut file = fs::File::open(&path)?;
        let metadata = file.metadata()?;

        let content = if metadata.len() > CHUNK_SIZE as u64 {
            // For large files, read in chunks
            let mut buffer = Vec::with_capacity(CHUNK_SIZE);
            file.take(CHUNK_SIZE as u64).read_to_end(&mut buffer)?;
            String::from_utf8_lossy(&buffer).to_string()
        } else {
            // For small files, read all at once
            let mut content = String::new();
            file.read_to_string(&mut content)?;
            content
        };
        Ok::<_, AppError>(content)
    })
    .await
    .map_err(|e| AppError::from(e.to_string()))??;

    // Update cache with new content
    {
        let mut cache_guard = cache.lock().await;
        cache_guard.set(path_clone, content.clone());
    }

    Ok(content)
}

#[command]
async fn save_file_content(path: String, content: String) -> Result<(), AppError> {
    // Spawn blocking operation for file system operations
    tokio::task::spawn_blocking(move || {
        // Create parent directories if they don't exist
        if let Some(parent) = Path::new(&path).parent() {
            fs::create_dir_all(parent)?;
        }

        let mut file = fs::File::create(&path)?;

        // Write in chunks for large content
        for chunk in content.as_bytes().chunks(CHUNK_SIZE) {
            file.write_all(chunk)?;
        }
        file.flush()?;

        Ok::<_, AppError>(())
    })
    .await
    .map_err(|e| AppError::from(e.to_string()))?
}

fn main() {
    let file_cache = Arc::new(Mutex::new(FileCache::new()));

    tauri::Builder::default()
        .manage(file_cache)
        .invoke_handler(tauri::generate_handler![
            get_file_tree,
            get_file_content,
            save_file_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
