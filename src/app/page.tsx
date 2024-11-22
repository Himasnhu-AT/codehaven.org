"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { open } from "@tauri-apps/api/dialog";
import { Loader2 } from "lucide-react";

const EditorLayout = dynamic(() => import("@/components/EditorLayout"), {
  ssr: false,
});

export default function Home() {
  const [path, setPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const openFolderDialog = async () => {
    setIsLoading(true);
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select Project Directory",
      });

      if (selected) {
        setPath(selected as string);
        setShowWelcome(false);
      } else {
        // User cancelled the dialog
        console.log("No directory selected");
      }
    } catch (error) {
      console.error("Error opening folder dialog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#CCCCCC]" />
          <p className="text-[#CCCCCC]">Loading file system...</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl text-[#CCCCCC]">Welcome to Codehaven</h1>
          <button
            onClick={openFolderDialog}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Open Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1E1E1E]">
      <EditorLayout
        initialPath={path!}
        onLoadComplete={() => setIsLoading(false)}
      />
    </div>
  );
}
