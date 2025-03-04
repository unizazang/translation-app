"use client";

import { useState, useEffect } from "react";
import { highlightDifferences } from "@/lib/textComparison";

interface TranslationCardProps {
  originalText: string;
  translations: { google: string; papago: string; deepL: string };
}

export default function TranslationCard({
  originalText,
  translations,
}: TranslationCardProps) {
  const [highlightedResults, setHighlightedResults] = useState<string[]>([]);

  // ✅ 하이라이트 상태를 useState로 관리
  const [highlightEnabled, setHighlightEnabled] = useState(true);

  // ✅ 하이라이트 적용 여부에 따라 다르게 처리
  const highlightedTexts = highlightEnabled
    ? highlightDifferences(
        originalText,
        [translations.google, translations.papago, translations.deepL],
        language
      )
    : [translations.google, translations.papago, translations.deepL];

  // ✅ 번역 결과 변경 시 하이라이트 업데이트
  useEffect(() => {
    setHighlightedResults(
      highlightDifferences(originalText, [
        translations.google,
        translations.papago,
        translations.deepL,
      ])
    );
  }, [originalText, translations]);

  return (
    <div className="w-full border p-4 rounded-lg">
      <h3 className="text-lg font-semibold">원본 문장</h3>
      <p>{originalText}</p>
      {/* ✅ 하이라이트 토글 버튼 추가 */}
      <button
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => setHighlightEnabled(!highlightEnabled)}
      >
        {highlightEnabled ? "하이라이트 끄기" : "하이라이트 켜기"}
      </button>

      <h3 className="text-lg font-semibold">번역 결과</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-2">
          <strong>Google:</strong>
          <p
            className="p-2"
            dangerouslySetInnerHTML={{ __html: highlightedTexts[0] }}
          />
        </div>
        <div className="border p-2">
          <strong>Papago:</strong>
          <p
            className="p-2"
            dangerouslySetInnerHTML={{ __html: highlightedTexts[1] }}
          />
        </div>
        <div className="border p-2">
          <strong>DeepL:</strong>
          <p
            className="p-2"
            dangerouslySetInnerHTML={{ __html: highlightedTexts[2] }}
          />
        </div>
      </div>
    </div>
  );
}
