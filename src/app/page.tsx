"use client";

import dynamic from "next/dynamic";

const EditorLayout = dynamic(() => import("@/components/EditorLayout"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="h-screen bg-[#1E1E1E]">
      <EditorLayout />
    </div>
  );
}
