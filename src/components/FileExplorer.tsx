import React from "react";
import { FileTreeNode } from "@/types/FileTree";

interface FileExplorerProps {
  fileTree: FileTreeNode;
  onFileSelect: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  fileTree,
  onFileSelect,
}) => {
  const renderTree = (node: FileTreeNode) => (
    <ul className="pl-4">
      {node.type === "directory" && (
        <li key={node.path} className="text-gray-300">
          <span className="font-bold">{node.name}</span>
          {node.children && node.children.map((child) => renderTree(child))}
        </li>
      )}
      {node.type === "file" && (
        <li
          key={node.path}
          className="text-blue-300 cursor-pointer hover:text-blue-100"
          onClick={() => onFileSelect(node.path)}
        >
          {node.name}
        </li>
      )}
    </ul>
  );

  return (
    <div className="bg-gray-800 text-white p-4 h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4">CodeHaven</h2>
      {renderTree(fileTree)}
    </div>
  );
};

export default FileExplorer;
