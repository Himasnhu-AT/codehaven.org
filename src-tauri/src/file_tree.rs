use crate::error::AppError;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::{fs, path::Path, time::SystemTime};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileTreeNode {
    pub name: String,
    pub path: String,
    #[serde(rename = "type")]
    pub node_type: String,
    pub children: Option<Vec<FileTreeNode>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub size: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub modified: Option<String>,
}

const MAX_PARALLEL_DIRS: usize = 50;

pub fn sort_tree(node: &mut FileTreeNode) {
    if let Some(children) = &mut node.children {
        // Sort children
        children.sort_by(|a, b| {
            // First compare by type (files before directories)
            let type_order = a.node_type.cmp(&b.node_type);
            // If types are the same, compare by name (case-insensitive)
            if type_order == std::cmp::Ordering::Equal {
                a.name.to_lowercase().cmp(&b.name.to_lowercase())
            } else {
                type_order
            }
        });

        // Recursively sort children's children
        for child in children.iter_mut() {
            sort_tree(child);
        }
    }
}

pub fn read_dir_recursive_inner<P: AsRef<Path>>(
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
