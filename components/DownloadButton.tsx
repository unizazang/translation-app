"use client";

import { TranslatedTextBlock } from "@/lib/pdfLayout";
import { generateTranslatedPdf } from "@/lib/pdfGenerator";

interface DownloadButtonProps {
  translatedBlocks: TranslatedTextBlock[][];
}

export default function DownloadButton({
  translatedBlocks,
}: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      const pdfBlob = await generateTranslatedPdf(translatedBlocks);
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
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-4 px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium shadow-none hover:bg-gray-100 transition"
    >
      번역된 PDF 다운로드
    </button>
  );
}
