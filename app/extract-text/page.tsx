"use client";

import { useState } from "react";
import PdfUploader from "@/components/PdfUploader";
import PdfTextExtractor from "@/components/PdfTextExtractor";
import { PdfPageData } from "@/lib/pdfProcessor";

export default function ExtractTextPage() {
  const [extractedText, setExtractedText] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleTextExtracted = (text: PdfPageData[][]) => {
    try {
      const extractedString = text
        .map((page) =>
          page
            .map((data) => data.textBlocks.map((block) => block.text).join(" "))
            .join("\n")
        )
        .join("\n\n");
      setExtractedText(extractedString);
      setError("");
    } catch (err) {
      console.error("텍스트 추출 중 오류 발생:", err);
      setError("텍스트 추출 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800">📄 PDF 글자 추출</h1>
      <p className="text-gray-600 mt-2">
        PDF에서 텍스트를 추출하는 기능입니다.
      </p>

      <PdfUploader onTextExtracted={handleTextExtracted} />

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {extractedText && <PdfTextExtractor text={extractedText} />}
    </div>
  );
}
