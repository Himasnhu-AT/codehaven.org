// Add the necessary imports
use serde::{Deserialize, Serialize};
use tauri::command;

// Define the FileTreeNode struct
#[derive(Serialize, Deserialize)]
struct FileTreeNode {
    name: String,
    path: String,
    #[serde(rename = "type")]
    node_type: String,
    children: Option<Vec<FileTreeNode>>,
}

// Implement a function to generate sample data
fn generate_sample_data() -> FileTreeNode {
    FileTreeNode {
        name: "codehaven".to_string(),
        path: "codehaven".to_string(),
        node_type: "directory".to_string(),
        children: Some(vec![
            FileTreeNode {
                name: "src".to_string(),
                path: "codehaven/src".to_string(),
                node_type: "directory".to_string(),
                children: Some(vec![
                    FileTreeNode {
                        name: "app".to_string(),
                        path: "codehaven/src/app".to_string(),
                        node_type: "directory".to_string(),
                        children: Some(vec![
                            FileTreeNode {
                                name: "globals.css".to_string(),
                                path: "codehaven/src/app/globals.css".to_string(),
                                node_type: "file".to_string(),
                                children: None,
                            },
                            FileTreeNode {
                                name: "layout.tsx".to_string(),
                                path: "codehaven/src/app/layout.tsx".to_string(),
                                node_type: "file".to_string(),
                                children: None,
                            },
                            FileTreeNode {
                                name: "page.tsx".to_string(),
                                path: "codehaven/src/app/page.tsx".to_string(),
                                node_type: "file".to_string(),
                                children: None,
                            },
                        ]),
                    },
                    FileTreeNode {
                        name: "components".to_string(),
                        path: "codehaven/src/components".to_string(),
                        node_type: "directory".to_string(),
                        children: Some(vec![
                            FileTreeNode {
                                name: "EditorLayout.tsx".to_string(),
                                path: "codehaven/src/components/EditorLayout.tsx".to_string(),
                                node_type: "file".to_string(),
                                children: None,
                            },
                            FileTreeNode {
                                name: "FileExplorer.tsx".to_string(),
                                path: "codehaven/src/components/FileExplorer.tsx".to_string(),
                                node_type: "file".to_string(),
                                children: None,
                            },
                            FileTreeNode {
                                name: "MonacoEditor.tsx".to_string(),
                                path: "codehaven/src/components/MonacoEditor.tsx".to_string(),
                                node_type: "file".to_string(),
                                children: None,
                            },
                        ]),
                    },
                    FileTreeNode {
                        name: "lib".to_string(),
                        path: "codehaven/src/lib".to_string(),
                        node_type: "directory".to_string(),
                        children: Some(vec![FileTreeNode {
                            name: "utils.ts".to_string(),
                            path: "codehaven/src/lib/utils.ts".to_string(),
                            node_type: "file".to_string(),
                            children: None,
                        }]),
                    },
                    FileTreeNode {
                        name: "types".to_string(),
                        path: "codehaven/src/types".to_string(),
                        node_type: "directory".to_string(),
                        children: Some(vec![FileTreeNode {
                            name: "FileTree.ts".to_string(),
                            path: "codehaven/src/types/FileTree.ts".to_string(),
                            node_type: "file".to_string(),
                            children: None,
                        }]),
                    },
                ]),
            },
            FileTreeNode {
                name: "fonts".to_string(),
                path: "codehaven/fonts".to_string(),
                node_type: "directory".to_string(),
                children: None,
            },
        ]),
    }
}

// Implement the Tauri commands
#[command]
fn get_file_tree() -> Result<FileTreeNode, String> {
    Ok(generate_sample_data())
}

#[command]
fn get_file_content(path: String) -> Result<String, String> {
    // Implement the logic to get the file content
    // For now, return a placeholder content
    Ok("Sample file content".to_string())
}

#[command]
fn save_file_content(path: String, content: String) -> Result<(), String> {
    // Implement the logic to save the file content
    // For now, just return Ok(())
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_file_tree,
            get_file_content,
            save_file_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
