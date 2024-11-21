"use client";

import { motion, useInView } from "framer-motion";
import {
  Zap,
  Globe,
  Lightbulb,
  Code,
  Shield,
  Cpu,
  Terminal,
  Brain,
  Bot,
  Wand2,
  GitBranch,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

// Logo Component
function Logo() {
  const ref = useRef(null);

  return (
    <motion.div
      className="w-40 h-40 bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className=" rounded-2xl flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Terminal className="w-8 h-8 text-[#06c]" />
      </motion.div>
      <motion.span
        className="text-2xl font-bold text-[#06c] mt-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        CodeHaven
      </motion.span>
    </motion.div>
  );
}

// Main Component
export default function Home() {
  const features = [
    {
      icon: <Zap className="w-12 h-12 text-[#06c]" />,
      title: "Blazing Fast",
      description: "Powered by Rust and Tauri for native performance",
    },
    {
      icon: <Globe className="w-12 h-12 text-[#06c]" />,
      title: "Cross-Platform",
      description: "Runs seamlessly on Windows, macOS, and Linux",
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-[#06c]" />,
      title: "Intelligent",
      description: "Smart code suggestions and intuitive interface",
    },
    {
      icon: <Code className="w-12 h-12 text-[#06c]" />,
      title: "Multi-Language",
      description: "Supports JavaScript, TypeScript, Rust, and more",
    },
    {
      icon: <Shield className="w-12 h-12 text-[#06c]" />,
      title: "Secure",
      description: "Built with security in mind from the ground up",
    },
    {
      icon: <Cpu className="w-12 h-12 text-[#06c]" />,
      title: "Resource Efficient",
      description: "Minimal CPU and memory usage",
    },
    {
      icon: <Brain className="w-12 h-12 text-[#06c]" />,
      title: "AI-Driven Insights",
      description: "Real-time code suggestions powered by AI",
    },
    {
      icon: <Bot className="w-12 h-12 text-[#06c]" />,
      title: "Context-Aware Completion",
      description: "AI understands your coding style for better suggestions",
    },
  ];

  const aiFeatures = [
    {
      icon: <Wand2 className="w-12 h-12 text-[#06c]" />,
      title: "AI Task Automation",
      description: "Automate repetitive tasks with intelligent AI agents",
    },
    {
      icon: <GitBranch className="w-12 h-12 text-[#06c]" />,
      title: "Smart Version Control",
      description: "AI-assisted commit messages and merge conflict resolution",
    },
    {
      icon: <RefreshCw className="w-12 h-12 text-[#06c]" />,
      title: "Continuous Learning",
      description: "AI models that adapt to your coding patterns over time",
    },
  ];

  const platforms = [
    {
      icon: (
        <Image
          src={"/apple.svg"}
          width={32}
          height={32}
          className="ml-3"
          alt={"MacOS image"}
        />
      ),
      name: "macOS",
    },
    {
      icon: (
        <Image
          src={"/windows.svg"}
          height={32}
          width={32}
          className="ml-3"
          alt={"Windows image"}
        />
      ),
      name: "Windows",
    },
    {
      icon: (
        <Image
          src={"/linux.svg"}
          width={32}
          height={32}
          className="w-8 h-8"
          alt={"Linux image"}
        />
      ),
      name: "Linux",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans">
      {/* Hero Section */}
      <section className="min-h-screen bg-[#fbfbfd] flex items-center justify-center">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center mb-6"
          >
            <Logo />
          </motion.div>
          <motion.h2
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Code Without Limits
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Experience the future of software development with CodeHaven IDE,
            powered by Tauri, Rust, and advanced AI for unparalleled performance
            and automation.
          </motion.p>
          <motion.div
            className="flex justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a
              href="/download"
              className="px-6 py-3 bg-[#06c] text-white rounded-full hover:bg-[#05a] transition-colors"
            >
              Join Beta
            </a>
            <a
              href="https://github.com/CodeHaven-ide"
              className="px-6 py-3 bg-[#e6e6e6] text-[#1d1d1f] rounded-full hover:bg-[#d9d9d9] transition-colors"
            >
              GitHub Repository
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="ai-features" className="py-20 bg-[#fbfbfd]">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">
            AI-Powered Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Meet Your AI Coding Assistants
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-xl font-semibold mb-4">CodeBuddy</h4>
              <p className="mb-4">
                Your personal AI coding companion that learns your style and
                preferences.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Suggests code completions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Explains complex code snippets
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Recommends best practices
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-xl font-semibold mb-4">TaskMaster</h4>
              <p className="mb-4">
                Automate repetitive tasks and streamline your workflow.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Generates boilerplate code
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Automates code refactoring
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Manages project dependencies
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section id="technology" className="py-20 bg-[#fbfbfd]">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Powered by Cutting-Edge Technology
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-xl font-semibold mb-4">Core Technologies</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  Tauri: Lightweight, secure framework
                </li>
                <li className="flex items-center">
                  Rust: Performance and reliability
                </li>
                <li className="flex items-center">
                  Next.js: React framework for UI
                </li>
                <li className="flex items-center">
                  AI: Advanced machine learning models
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-xl font-semibold mb-4">
                Supported Platforms
              </h4>
              <div className="flex justify-around items-center mt-10">
                {platforms.map((platform, index) => (
                  <div key={index} className="text-center">
                    {platform.icon}
                    <p className="mt-2">{platform.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="download" className="bg-[#06c] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Coding?
          </h3>
          <p className="text-xl mb-8">
            Join the CodeHaven beta and transform your development workflow with
            AI-powered automation today.
          </p>
          <a
            href="/download"
            className="px-8 py-4 bg-white text-[#06c] rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Join Beta
          </a>
          <p className="mt-4 text-sm">
            Available for macOS, Windows, and Linux
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2023 CodeHaven IDE. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>{" "}
            |
            <a href="#" className="hover:underline ml-2">
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
