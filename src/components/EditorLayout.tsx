import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import FileExplorer from "./FileExplorer";
import Header from "./Header";
import { FileTreeNode } from "@/types/FileTree";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import {
  X,
  Files,
  Search,
  GitBranch,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const CustomEditor = dynamic(() => import("../editor/Editor"), { ssr: false });

interface OpenFile {
  path: string;
  content: string;
  language: string;
}

interface EditorLayoutProps {
  initialPath: string;
  onLoadComplete: () => void;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  initialPath,
  onLoadComplete,
}) => {
  const [fileTree, setFileTree] = useState<FileTreeNode | null>(null);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<string | null>("explorer");
  const [sidebarWidth, setSidebarWidth] = useState<number>(20); // 20% of the total width

  useEffect(() => {
    fetchFileTree();
  });

  const fetchFileTree = async () => {
    try {
      const tree = await invoke<FileTreeNode>("get_file_tree", {
        path: initialPath,
      });
      setFileTree(tree);
      onLoadComplete();
    } catch (error) {
      console.error("Error fetching file tree:", error);
      onLoadComplete();
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

  const toggleSidebar = (sidebar: string) => {
    setActiveSidebar((prevSidebar) =>
      prevSidebar === sidebar ? null : sidebar,
    );
  };

  const renderSidebarContent = () => {
    switch (activeSidebar) {
      case "explorer":
        return (
          fileTree && (
            <FileExplorer fileTree={fileTree} onFileSelect={handleFileSelect} />
          )
        );
      case "search":
        return (
          <div className="p-4 text-[#CCCCCC]">
            Search functionality (to be implemented)
          </div>
        );
      case "git":
        return (
          <div className="p-4 text-[#CCCCCC]">
            Git functionality (to be implemented)
          </div>
        );
      case "debug":
        return (
          <div className="p-4 text-[#CCCCCC]">
            Debug functionality (to be implemented)
          </div>
        );
      case "extensions":
        return (
          <div className="p-4 text-[#CCCCCC]">
            Extensions functionality (to be implemented)
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1E1E1E] text-[#CCCCCC]">
      <Header />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={5} minSize={5} maxSize={5}>
          <div className="h-full bg-[#333333] flex flex-col items-center py-2">
            <Button
              variant="ghost"
              size="icon"
              className={`mb-2 ${activeSidebar === "explorer" ? "bg-[#252526]" : ""}`}
              onClick={() => toggleSidebar("explorer")}
            >
              <Files className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`mb-2 ${activeSidebar === "search" ? "bg-[#252526]" : ""}`}
              onClick={() => toggleSidebar("search")}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`mb-2 ${activeSidebar === "git" ? "bg-[#252526]" : ""}`}
              onClick={() => toggleSidebar("git")}
            >
              <GitBranch className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`mb-2 ${activeSidebar === "debug" ? "bg-[#252526]" : ""}`}
              onClick={() => toggleSidebar("debug")}
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`mb-2 ${activeSidebar === "extensions" ? "bg-[#252526]" : ""}`}
              onClick={() => toggleSidebar("extensions")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </ResizablePanel>
        {activeSidebar && (
          <>
            <ResizablePanel
              defaultSize={sidebarWidth}
              minSize={10}
              maxSize={40}
              onResize={setSidebarWidth}
            >
              <div className="h-full bg-[#252526] border-r border-[#3C3C3C] overflow-auto">
                {renderSidebarContent()}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel>
          <div className="h-full flex flex-col">
            <div className="flex bg-[#252526] text-[#CCCCCC] border-b border-[#3C3C3C]">
              {openFiles.map((file) => (
                <div key={file.path} className="relative group">
                  <Button
                    variant={activeFile === file.path ? "secondary" : "ghost"}
                    className="px-3 py-1 text-sm flex items-center justify-between"
                    onClick={() => setActiveFile(file.path)}
                  >
                    <span className="truncate max-w-[100px]">
                      {file.path.split("/").pop()}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 opacity-0 group-hover:opacity-100"
                    onClick={() => handleCloseFile(file.path)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex-grow">
              {activeFile && (
                <CustomEditor
                  initialText={
                    openFiles.find((file) => file.path === activeFile)
                      ?.content || ""
                  }
                  onChange={(newValue) =>
                    handleFileChange(activeFile, newValue)
                  }
                />
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default EditorLayout;
