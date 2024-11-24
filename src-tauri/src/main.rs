mod cache;
mod commands;
mod error;
mod file_tree;

use cache::FileCache;
use commands::{get_file_content, get_file_tree, save_file_content};
use std::sync::Arc;
use tokio::sync::Mutex;

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
