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

#[cfg(test)]
mod tests {
    use super::*;
    use std::thread::sleep;
    use std::time::Duration;

    #[test]
    fn test_file_cache_set_and_get() {
        let mut cache = FileCache::new();
        let path = "test_path".to_string();
        let content = "test_content".to_string();

        cache.set(path.clone(), content.clone());
        assert_eq!(cache.get(&path), Some(&content));
    }

    #[test]
    fn test_file_cache_expiration() {
        let mut cache = FileCache::new();
        let path = "test_path".to_string();
        let content = "test_content".to_string();

        cache.set(path.clone(), content.clone());
        sleep(Duration::from_secs(6)); // Wait for cache to expire
        assert_eq!(cache.get(&path), None);
    }

    #[test]
    fn test_file_cache_nonexistent_path() {
        let cache = FileCache::new();
        assert_eq!(cache.get("nonexistent_path"), None);
    }
}
