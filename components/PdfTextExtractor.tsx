"use client";

import { useState } from "react";

export default function PdfTextExtractor({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-100">
      <h2 className="text-lg font-semibold">📜 추출된 텍스트</h2>
      <textarea
        className="w-full h-48 p-2 border rounded mt-2 bg-white resize-none"
        value={text}
        readOnly
      />
      <button
        onClick={handleCopy}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {copied ? "✅ 복사됨!" : "📋 복사하기"}
      </button>
    </div>
  );
}
