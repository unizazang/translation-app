"use client";

import { useState } from "react";
import { generateTranslatedPdf } from "@/lib/pdfGenerator";

interface DownloadButtonProps {
  originalPdf: ArrayBuffer;
  translatedTextData: PdfPageData[];
}

export default function DownloadButton({
  originalPdf,
  translatedTextData,
}: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      // ✅ 번역된 PDF 생성
      const pdfBytes = await generateTranslatedPdf(originalPdf, translatedTextData);

      // ✅ Blob을 생성하여 다운로드 링크 만들기
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // ✅ 다운로드 링크 생성 및 클릭 이벤트 실행
      const a = document.createElement("a");
      a.href = url;
      a.download = "translated.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // ✅ URL 해제
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ PDF 다운로드 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      disabled={isLoading}
    >
      {isLoading ? "다운로드 중..." : "📥 PDF 다운로드"}
    </button>
  );
}
