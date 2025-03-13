"use client";

import { useEffect, useState } from "react";
import { generateTranslatedPdf } from "@/lib/pdfGenerator";
import DownloadButton from "@/components/DownloadButton";

interface TranslationResultProps {
  originalPdf: ArrayBuffer;
  translatedTextData: PdfPageData[];
  isTranslating: boolean;
}

export default function TranslationResult({
  originalPdf,
  translatedTextData,
  isTranslating,
}: TranslationResultProps) {
  const [isReadyForDownload, setIsReadyForDownload] = useState(false);

  // ✅ 번역이 완료되면 다운로드 버튼 표시
  useEffect(() => {
    if (!isTranslating && translatedTextData.length > 0) {
      setIsReadyForDownload(true);
    }
  }, [isTranslating, translatedTextData]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">번역 결과</h2>

      {/* ✅ 번역된 텍스트 출력 */}
      <div className="mt-4">
        {translatedTextData.map((page, index) => (
          <div key={index} className="mb-6 p-4 border rounded bg-gray-50">
            <h3 className="font-bold text-gray-700">📄 페이지 {index + 1}</h3>
            <p className="text-gray-600 whitespace-pre-line">{page.translatedText}</p>
          </div>
        ))}
      </div>

      {/* ✅ 번역 완료 후 다운로드 버튼 표시 */}
      {isReadyForDownload && (
        <div className="mt-4">
          <DownloadButton originalPdf={originalPdf} translatedTextData={translatedTextData} />
        </div>
      )}
    </div>
  );
}
