import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import FileExplorer from "./FileExplorer";
import { FileTreeNode } from "@/types/FileTree";
import { invoke } from "@tauri-apps/api";

const MonacoEditor = dynamic(() => import("./MonacoEditor"), { ssr: false });

interface OpenFile {
  path: string;
  content: string;
  language: string;
}

const EditorLayout: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileTreeNode | null>(null);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  useEffect(() => {
    fetchFileTree();
  }, []);

  const fetchFileTree = async () => {
    try {
      const tree = await invoke<FileTreeNode>("get_file_tree");
      setFileTree(tree);
    } catch (error) {
      console.error("Error fetching file tree:", error);
    }
  };

  const handleFileSelect = async (path: string) => {
    if (!openFiles.some((file) => file.path === path)) {
      try {
        const content = await invoke<string>("get_file_content", { path });
        const language = getLanguageFromPath(path);
        setOpenFiles([...openFiles, { path, content, language }]);
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    }
    setActiveFile(path);
  };

  const handleFileChange = async (
    path: string,
    newContent: string | undefined,
  ) => {
    if (newContent !== undefined) {
      try {
        await invoke("save_file_content", { path, content: newContent });
        setOpenFiles(
          openFiles.map((file) =>
            file.path === path ? { ...file, content: newContent } : file,
          ),
        );
      } catch (error) {
        console.error("Error saving file content:", error);
      }
    }
  };

  const getLanguageFromPath = (path: string): string => {
    const extension = path.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      default:
        return "plaintext";
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-900">
        {fileTree && (
          <FileExplorer fileTree={fileTree} onFileSelect={handleFileSelect} />
        )}
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="flex bg-gray-800 text-white">
          {openFiles.map((file) => (
            <div
              key={file.path}
              className={`px-4 py-2 cursor-pointer ${activeFile === file.path ? "bg-gray-700" : "bg-gray-800"}`}
              onClick={() => setActiveFile(file.path)}
            >
              {file.path.split("/").pop()}
            </div>
          ))}
        </div>
        <div className="flex-grow">
          {activeFile && (
            <MonacoEditor
              language={
                openFiles.find((file) => file.path === activeFile)?.language ||
                "plaintext"
              }
              value={
                openFiles.find((file) => file.path === activeFile)?.content ||
                ""
              }
              onChange={(newValue) => handleFileChange(activeFile, newValue)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
