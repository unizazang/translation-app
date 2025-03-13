"use client";

import { useEffect, useState } from "react";
import DownloadButton from "./DownloadButton";
import { TranslatedTextBlock } from "@/lib/pdfLayout";

interface TranslationResultProps {
  translatedPages: TranslatedTextBlock[][];
  totalSentences: number;
}

export default function TranslationResult({ translatedPages, totalSentences }: TranslationResultProps) {
  const [isTranslationComplete, setIsTranslationComplete] = useState(false);

  useEffect(() => {
    // ✅ 번역된 문장이 전체 문장 개수와 일치하면 완료 상태로 변경
    const translatedCount = translatedPages.reduce((acc, page) => acc + page.length, 0);
    if (translatedCount >= totalSentences) {
      setIsTranslationComplete(true);
    }
  }, [translatedPages, totalSentences]);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold">번역 결과</h2>

      {/* ✅ 번역 완료 시 PDF 다운로드 버튼 표시 */}
      {isTranslationComplete && (
        <div className="mt-4">
          <DownloadButton translatedPages={translatedPages} />
        </div>
      )}

      {/* ✅ 번역 진행 상황 표시 */}
      <p className="mt-2 text-gray-600">
        번역 진행: {translatedPages.reduce((acc, page) => acc + page.length, 0)} / {totalSentences}
      </p>
    </div>
  );
}
