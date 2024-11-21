import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import FileExplorer from "./FileExplorer";
import { FileTreeNode } from "@/types/FileTree";
import { invoke } from "@tauri-apps/api/tauri";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

  const handleCloseFile = (path: string) => {
    setOpenFiles(openFiles.filter((file) => file.path !== path));
    if (activeFile === path) {
      setActiveFile(openFiles[0]?.path || null);
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
    <div className="flex h-screen bg-[#1E1E1E] text-[#CCCCCC]">
      <div className="w-64 bg-[#252526] border-r border-[#3C3C3C]">
        {fileTree && (
          <FileExplorer fileTree={fileTree} onFileSelect={handleFileSelect} />
        )}
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="flex-1 flex flex-col">
        <div className="flex bg-[#252526] text-[#CCCCCC] border-b border-[#3C3C3C]">
          {openFiles.map((file) => (
            <Button
              key={file.path}
              variant={activeFile === file.path ? "secondary" : "ghost"}
              className="px-3 py-1 text-sm flex items-center justify-between"
              onClick={() => setActiveFile(file.path)}
            >
              <span className="truncate max-w-[100px]">
                {file.path.split("/").pop()}
              </span>
              <X
                className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFile(file.path);
                }}
              />
            </Button>
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
