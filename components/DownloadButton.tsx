"use client";

import { useState } from "react";
import { generateTranslatedPdf } from "@/lib/pdfGenerator";
import { TranslatedTextBlock } from "@/lib/pdfLayout";

interface DownloadButtonProps {
  translatedPages: TranslatedTextBlock[][];
}

export default function DownloadButton({ translatedPages }: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const pdfData = await generateTranslatedPdf(translatedPages);
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "translated.pdf"; // ✅ 파일명 지정
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF 다운로드 오류:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`px-4 py-2 rounded text-white ${isGenerating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
    >
      {isGenerating ? "PDF 생성 중..." : "PDF 다운로드"}
    </button>
  );
}
