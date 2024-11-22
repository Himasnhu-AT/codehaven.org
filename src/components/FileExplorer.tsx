import React from "react";
import { FileTreeNode } from "@/types/FileTree";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronRight, File, Folder } from "lucide-react";

interface FileExplorerProps {
  fileTree: FileTreeNode;
  onFileSelect: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  fileTree,
  onFileSelect,
}) => {
  const renderTree = (node: FileTreeNode, depth: number = 0) => (
    <AccordionItem value={node.path} key={node.path} className="border-none">
      {node.type === "directory" ? (
        <>
          <AccordionTrigger className="py-1 hover:no-underline">
            <div
              className="flex items-center text-sm"
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
              <Folder className="mr-2 h-4 w-4 text-yellow-400" />
              <span>{node.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {node.children &&
              node.children.map((child) => renderTree(child, depth + 1))}
          </AccordionContent>
        </>
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start py-1 px-4 text-sm"
          onClick={() => onFileSelect(node.path)}
        >
          <div
            className="flex items-center"
            style={{ paddingLeft: `${depth * 12}px` }}
          >
            <File className="mr-2 h-4 w-4 text-blue-400" />
            <span>{node.name}</span>
          </div>
        </Button>
      )}
    </AccordionItem>
  );

  return (
    <div className="h-full bg-[#252526] text-[#CCCCCC] p-2 overflow-auto">
      <h2 className="text-sm font-semibold mb-2 px-2">EXPLORER</h2>
      <Accordion type="multiple" className="w-full">
        {renderTree(fileTree)}
      </Accordion>
    </div>
  );
};

export default FileExplorer;
