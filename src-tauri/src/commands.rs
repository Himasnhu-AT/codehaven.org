use crate::cache::FileCache;
use crate::error::AppError;
use crate::file_tree::{read_dir_recursive_inner, sort_tree, FileTreeNode};
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
    tokio::task::spawn_blocking(move || {
        let mut tree = read_dir_recursive_inner(path, 0, max_depth.unwrap_or(std::usize::MAX))?;
        sort_tree(&mut tree);
        Ok(tree)
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

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    #[tokio::test]
    async fn test_get_file_tree_invalid_path() {
        let result = get_file_tree("invalid_path".to_string(), Some(2)).await;
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_save_file_content() {
        let test_file = "test_save_file.txt";
        let content = "Hello, world!";

        let result = save_file_content(test_file.to_string(), content.to_string()).await;
        assert!(result.is_ok());

        let saved_content = fs::read_to_string(test_file).unwrap();
        assert_eq!(saved_content, content);

        fs::remove_file(test_file).unwrap();
    }

    #[tokio::test]
    async fn test_save_file_content_create_directories() {
        let test_file = "test_dir/test_save_file.txt";
        let content = "Hello, world!";

        let result = save_file_content(test_file.to_string(), content.to_string()).await;
        assert!(result.is_ok());

        let saved_content = fs::read_to_string(test_file).unwrap();
        assert_eq!(saved_content, content);

        fs::remove_dir_all("test_dir").unwrap();
    }

    #[tokio::test]
    async fn test_save_file_content_invalid_path() {
        let result = save_file_content("".to_string(), "content".to_string()).await;
        assert!(result.is_err());
    }
}
