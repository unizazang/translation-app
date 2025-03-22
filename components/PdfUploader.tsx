"use client";

import { useState } from "react";
import { loadPdf, extractTextFromPdf, PdfPageData } from "@/lib/pdfProcessor";
import FileDropzone from "./FileDropzone";

interface PdfUploaderProps {
  onTextExtracted: (text: PdfPageData[][]) => void;
}

export default function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * ✅ PDF 업로드 및 텍스트 추출 핸들러
   */
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const pdfBuffer: ArrayBuffer = await loadPdf(file);
      const extractedText: PdfPageData[][] = await extractTextFromPdf(
        pdfBuffer
      );
      onTextExtracted(extractedText);
    } catch (error) {
      console.error("❌ PDF 처리 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">PDF 업로드</h2>
      <FileDropzone
        onFileAccepted={handleFileUpload}
        accept={{
          "application/pdf": [".pdf"],
        }}
        fileType="pdf"
        maxSize={57 * 1024 * 1024}
      />
      {isLoading && <p className="text-blue-500 mt-2">PDF 처리 중...</p>}
    </div>
  );
}
