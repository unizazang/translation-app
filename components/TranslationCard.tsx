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

      <h3 className="text-lg font-semibold">번역 결과</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-2">
          <strong>Google:</strong>
          <p
            dangerouslySetInnerHTML={{ __html: highlightedResults[0] || "" }}
          />
        </div>
        <div className="border p-2">
          <strong>Papago:</strong>
          <p
            dangerouslySetInnerHTML={{ __html: highlightedResults[1] || "" }}
          />
        </div>
        <div className="border p-2">
          <strong>DeepL:</strong>
          <p
            dangerouslySetInnerHTML={{ __html: highlightedResults[2] || "" }}
          />
        </div>
      </div>
    </div>
  );
}
