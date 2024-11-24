use crate::cache::FileCache;
use crate::error::AppError;
use crate::file_tree::{read_dir_recursive_inner, FileTreeNode};
use std::sync::Arc;
use std::{fs, io::Read, io::Write, path::Path};
use tauri::command;
use tauri::State;
use tokio::sync::Mutex;

const CHUNK_SIZE: usize = 1024 * 1024; // 1MB chunks for large files

#[command]
pub async fn get_file_tree(
    path: String,
    max_depth: Option<usize>,
) -> Result<FileTreeNode, AppError> {
    // Spawn blocking operation to handle file system operations
    tokio::task::spawn_blocking(move || {
        read_dir_recursive_inner(path, 0, max_depth.unwrap_or(std::usize::MAX))
    })
    .await
    .map_err(|e| AppError::from(e.to_string()))?
}

#[command]
pub async fn get_file_content(
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
pub async fn save_file_content(path: String, content: String) -> Result<(), AppError> {
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
