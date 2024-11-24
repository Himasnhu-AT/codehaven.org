use serde::Serialize;
use std::io;

#[derive(Debug, Serialize)]
pub struct AppError {
    pub message: String,
    pub error_type: String,
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
