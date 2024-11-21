import { useEffect } from "react";
import Editor, { loader } from "@monaco-editor/react";

loader.config({ paths: { vs: "/monaco-editor/min/vs" } });

interface MonacoEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  language,
  value,
  onChange,
}) => {
  useEffect(() => {
    (window as any).MonacoEnvironment = {
      getWorkerUrl: function (_: unknown, label: unknown) {
        console.log(`Loading worker for: ${label}`);
        if (label === "typescript" || label === "javascript") {
          return "_next/static/ts.worker.js";
        }
        if (label === "css" || label === "scss" || label === "less") {
          return "_next/static/css.worker.js";
        }
        if (label === "html") {
          return "_next/static/html.worker.js";
        }
        if (label === "json") {
          return "_next/static/json.worker.js";
        }
        return "_next/static/editor.worker.js";
      },
    };

    loader.init().then(
      () => {
        console.log("Monaco Editor initialized successfully");
      },
      (error) => {
        console.error("Monaco Editor initialization error:", error);
      },
    );
  }, []);

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        scrollbar: {
          vertical: "visible",
          horizontal: "visible",
        },
        lineNumbers: "on",
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
      }}
    />
  );
};

export default MonacoEditor;
