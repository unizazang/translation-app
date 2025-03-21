"use client";

import { useState } from "react";
import PdfUploader from "@/components/PdfUploader";
import PdfTextExtractor from "@/components/PdfTextExtractor";

// ✅ PdfPageData 타입 정의
type PdfPageData = {
  text: string;
  // ... 필요한 다른 필드들 ...
};

export default function ExtractTextPage() {
  const [extractedText, setExtractedText] = useState<string>("");

  // ✅ 새로운 함수 추가: PdfPageData[][]를 string으로 변환
  const handleTextExtracted = (text: PdfPageData[][]) => {
    const extractedString = text
      .map((page) => page.map((data) => data.text).join(" "))
      .join("\n");
    setExtractedText(extractedString);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800">📄 PDF 글자 추출</h1>
      <p className="text-gray-600 mt-2">
        PDF에서 텍스트를 추출하는 기능입니다.
      </p>

      {/* ✅ PDF 업로더 */}
      <PdfUploader onTextExtracted={handleTextExtracted} />

      {/* ✅ 텍스트 추출 결과 */}
      {extractedText && <PdfTextExtractor text={extractedText} />}
    </div>
  );
}
