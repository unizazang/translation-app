"use client";

import { useState } from "react";
import { loadPdf, extractTextFromPdf, PdfPageData } from "@/lib/pdfProcessor";

export function useTextExtraction() {
  const [pdfText, setPdfText] = useState<PdfPageData[][]>([]);

  /**
   * ✅ PDF에서 텍스트를 추출하는 함수
   */
  const extractText = async (file: File) => {
    try {
      const pdfBuffer: ArrayBuffer = await loadPdf(file); // ✅ 올바른 타입 적용
      const textData: PdfPageData[][] = await extractTextFromPdf(pdfBuffer);
      setPdfText(textData); // ✅ 올바른 타입 적용
    } catch (error) {
      console.error("❌ PDF 텍스트 추출 중 오류 발생:", error);
    }
  };

  return {
    pdfText,
    extractText,
  };
}
