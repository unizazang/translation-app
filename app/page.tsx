"use client";

import { useState } from "react";
import PdfUploader from "@/components/PdfUploader";
import TranslationResult from "@/components/TranslationResult";

export default function Home() {
  const [pdfText, setPdfText] = useState<string>("");

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">메인 페이지</h1>

      {/* PDF 업로드 컴포넌트 */}
      <PdfUploader onTextExtracted={setPdfText} />

      {/* 번역 결과 표시 */}
      {/* {pdfText && <TranslationResult text={pdfText} />} */}

      <div>{pdfText && <TranslationResult text={pdfText} />}</div>
    </div>
  );
}
