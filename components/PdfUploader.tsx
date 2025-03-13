"use client";

import { useState } from "react";
import { loadPdf, extractTextFromPdf, PdfPageData } from "@/lib/pdfProcessor";

interface PdfUploaderProps {
  onTextExtracted: (text: PdfPageData[][]) => void;
}

export default function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * ✅ PDF 업로드 및 텍스트 추출 핸들러
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const pdfBuffer: ArrayBuffer = await loadPdf(file);
      const extractedText: PdfPageData[][] = await extractTextFromPdf(pdfBuffer);
      onTextExtracted(extractedText);
    } catch (error) {
      console.error("❌ PDF 처리 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold">PDF 업로드</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} className="mt-2" />
      {isLoading && <p className="text-blue-500 mt-2">PDF 처리 중...</p>}
    </div>
  );
}
