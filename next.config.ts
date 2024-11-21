import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: [
            "typescript",
            "javascript",
            "css",
            "html",
            "json",
            "rust",
            "python",
          ],
          features: [
            "coreCommands",
            "find",
            "contextmenu",
            "snippet",
            "formatters",
            "livePreview",
          ],
        }),
      );
    }
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
