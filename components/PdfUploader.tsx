"use client";

import { useState } from "react";
import { loadPdf, extractTextFromPdf } from "@/lib/pdfProcessor";

interface PdfUploaderProps {
  onTextExtracted: (text: string) => void; // 🟢 부모로 텍스트 전달하는 함수
}

export default function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const [error, setError] = useState<string | null>(null); // 에러 상태

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null); // 기존 에러 초기화
      const pdf = await loadPdf(file);
      const extractedText = await extractTextFromPdf(pdf);

      // ✅ 반환된 배열에서 텍스트만 추출하여 문자열로 변환
      const mergedText = extractedText
        .map((line) => line.map((word) => word.text).join(" ")) // 단어들을 합치기
        .join("\n"); // 줄 단위로 합치기

      onTextExtracted(mergedText); // 🟢 부모(page.tsx)로 텍스트 전달
    } catch (err) {
      setError("PDF를 처리하는 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white text-center">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        📄 PDF 업로드
      </h1>
      <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition inline-block">
        파일 선택
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
