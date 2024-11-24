use std::collections::HashMap;
use std::time::SystemTime;

pub struct FileCache {
    contents: HashMap<String, (String, SystemTime)>,
}

impl FileCache {
    pub fn new() -> Self {
        Self {
            contents: HashMap::new(),
        }
    }

    pub fn get(&self, path: &str) -> Option<&String> {
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

    pub fn set(&mut self, path: String, content: String) {
        self.contents.insert(path, (content, SystemTime::now()));
    }
}
