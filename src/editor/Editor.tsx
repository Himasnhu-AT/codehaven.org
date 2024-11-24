import React, { useEffect, useRef } from "react";
import { Editor } from "./Editor";

interface CustomEditorProps {
  initialText: string;
  onChange: (newText: string) => void;
}

const CustomEditor: React.FC<CustomEditorProps> = ({ initialText, onChange }) => {
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    const editor = new Editor(initialText);
    editorRef.current = editor;

    const handleKeyPress = (event: KeyboardEvent) => {
      editor.handleKeyPress(event);
      onChange(editor.getText());
    };

    const handleMouseClick = (event: MouseEvent) => {
      editor.handleMouseClick(event);
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleMouseClick);
    };
  }, [initialText, onChange]);

  return <div className="custom-editor">Custom Editor</div>;
};

export default CustomEditor;
