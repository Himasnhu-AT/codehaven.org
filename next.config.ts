import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: [
            "bat",
            "clojure",
            "cpp",
            "csharp",
            "css",
            "dart",
            "dockerfile",
            "go",
            "graphql",
            "html",
            "java",
            "javascript",
            "kotlin",
            "markdown",
            "objective-c",
            "python",
            "redis",
            "rust",
            "sql",
            "swift",
            "typescript",
            "xml",
            "yaml",
          ],
          features: [
            // "coreCommands",
            "find",
            "contextmenu",
            "snippet",
            // "formatters",
            // "livePreview",
          ],
        }),
      );
    }
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
