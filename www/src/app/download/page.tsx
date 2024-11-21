"use client";

import { motion } from "framer-motion";
import {
  Download,
  Apple,
  ComputerIcon as Windows,
  LaptopIcon as Linux,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
  const downloadOptions = [
    {
      name: "macOS",
      icon: <Apple className="w-8 h-8" />,
      version: "1.0.0 Beta",
      size: "75 MB",
    },
    {
      name: "Windows",
      icon: <Windows className="w-8 h-8" />,
      version: "1.0.0 Beta",
      size: "80 MB",
    },
    {
      name: "Linux",
      icon: <Linux className="w-8 h-8" />,
      version: "1.0.0 Beta",
      size: "70 MB",
    },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#06c]" />,
      title: "Lightning Fast",
      description: "Powered by Rust for native performance",
    },
    {
      icon: <Globe className="w-6 h-6 text-[#06c]" />,
      title: "Cross-Platform",
      description: "Available for macOS, Windows, and Linux",
    },
    {
      icon: <Shield className="w-6 h-6 text-[#06c]" />,
      title: "Secure",
      description: "Built with security as a top priority",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans">
      {/* Header */}
      <header className="bg-[#fbfbfd] sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-[#06c]">
            CodeHaven
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link href="/#features" className="hover:text-[#06c]">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#ai-features" className="hover:text-[#06c]">
                AI Features
              </Link>
            </li>
            <li>
              <Link href="/#technology" className="hover:text-[#06c]">
                Technology
              </Link>
            </li>
            <li>
              <Link href="/download" className="hover:text-[#06c]">
                Download
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Download Hero Section */}
      <section className="bg-[#fbfbfd] py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Download CodeHaven IDE
          </motion.h1>
          <motion.p
            className="text-xl mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience the future of coding with our AI-powered, cross-platform
            IDE. Choose your platform below to get started.
          </motion.p>
        </div>
      </section>

      {/* Download Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {downloadOptions.map((option, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">{option.icon}</div>
                <h2 className="text-2xl font-semibold mb-2">{option.name}</h2>
                <p className="text-gray-600 mb-4">Version {option.version}</p>
                <p className="text-gray-600 mb-6">Size: {option.size}</p>
                <a
                  href={`#download-${option.name.toLowerCase()}`}
                  className="px-6 py-3 bg-[#06c] text-white rounded-full hover:bg-[#05a] transition-colors flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download for {option.name}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="bg-[#fbfbfd] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Choose CodeHaven?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            System Requirements
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">macOS</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>macOS 10.15 or later</li>
                <li>4 GB RAM (8 GB recommended)</li>
                <li>1 GB available disk space</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Windows</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Windows 10 or later (64-bit)</li>
                <li>4 GB RAM (8 GB recommended)</li>
                <li>1 GB available disk space</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Linux</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Ubuntu 18.04 or later (64-bit)</li>
                <li>4 GB RAM (8 GB recommended)</li>
                <li>1 GB available disk space</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2023 CodeHaven IDE. All rights reserved.</p>
          <p className="mt-2">
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="#" className="hover:underline ml-2">
              Terms of Service
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
