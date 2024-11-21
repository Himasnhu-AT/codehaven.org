import React from "react";
import { FileTreeNode } from "@/types/FileTree";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { File, Folder } from "lucide-react";

interface FileExplorerProps {
  fileTree: FileTreeNode;
  onFileSelect: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  fileTree,
  onFileSelect,
}) => {
  const renderTree = (node: FileTreeNode) => (
    <AccordionItem value={node.path} key={node.path}>
      {node.type === "directory" ? (
        <>
          <AccordionTrigger className="py-1 hover:no-underline">
            <div className="flex items-center text-sm">
              <Folder className="mr-2 h-4 w-4" />
              <span>{node.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {node.children && node.children.map((child) => renderTree(child))}
          </AccordionContent>
        </>
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start py-1 px-4 text-sm"
          onClick={() => onFileSelect(node.path)}
        >
          <File className="mr-2 h-4 w-4" />
          <span>{node.name}</span>
        </Button>
      )}
    </AccordionItem>
  );

  return (
    <div className="bg-[#252526] text-[#CCCCCC] p-2 h-full overflow-auto">
      <h2 className="text-sm font-semibold mb-2 px-2">CodeHaven</h2>
      <Accordion type="multiple" className="w-full">
        {renderTree(fileTree)}
      </Accordion>
    </div>
  );
};

export default FileExplorer;
