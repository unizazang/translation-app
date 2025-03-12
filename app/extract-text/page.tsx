"use client";

import { useState } from "react";
import PdfUploader from "@/components/PdfUploader";
import PdfTextExtractor from "@/components/PdfTextExtractor";

export default function ExtractTextPage() {
  const [extractedText, setExtractedText] = useState<string>("");

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800">📄 PDF 글자 추출</h1>
      <p className="text-gray-600 mt-2">PDF에서 텍스트를 추출하는 기능입니다.</p>

      {/* ✅ PDF 업로더 */}
      <PdfUploader onTextExtracted={setExtractedText} />

      {/* ✅ 텍스트 추출 결과 */}
      {extractedText && <PdfTextExtractor text={extractedText} />}
    </div>
  );
}
