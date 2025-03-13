"use client";

import { TranslatedTextBlock } from "@/lib/pdfLayout"; // ✅ 올바르게 export된 타입 사용
import { generateTranslatedPdf } from "@/lib/pdfGenerator";

interface DownloadButtonProps {
  translatedBlocks: TranslatedTextBlock[];
}

export default function DownloadButton({ translatedBlocks }: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      // ✅ 배열을 페이지 단위의 2차원 배열로 변환
      const pdfData = await generateTranslatedPdf([translatedBlocks]);
      
      // ✅ Uint8Array → Blob 변환
      const pdfBlob = new Blob([pdfData], { type: "application/pdf" });

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
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      번역된 PDF 다운로드
    </button>
  );
}
