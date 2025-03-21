"use client";

import { useState } from "react";
import { TranslatedTextBlock } from "@/lib/pdfLayout";
import { generateTranslatedPdf } from "@/lib/pdfGenerator";

interface DownloadButtonProps {
  translatedBlocks: TranslatedTextBlock[][];
}

export default function DownloadButton({
  translatedBlocks,
}: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleDownload = async () => {
    if (translatedBlocks.length === 0) {
      setError("번역할 텍스트가 없습니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("📝 PDF 생성 시작:", translatedBlocks);
      const pdfBlob = await generateTranslatedPdf(translatedBlocks);
      console.log("✅ PDF 생성 완료");

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "translated.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ PDF 다운로드 오류:", error);
      setError("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDownload}
        disabled={isLoading || translatedBlocks.length === 0}
        className={`px-4 py-2 text-white rounded transition ${
          isLoading || translatedBlocks.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isLoading ? "PDF 생성 중..." : "번역된 PDF 다운로드"}
      </button>
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
