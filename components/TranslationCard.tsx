"use client";

import { useEffect, useState } from "react";
// import { highlightDifferences } from "@/lib/textComparison"; // ✅ 하이라이트 기능 비활성화

interface TranslationCardProps {
  originalText: string;
  translations: { google: string; papago: string; deepL: string };
  onSave: (original: string, translation: string) => void;
}

export default function TranslationCard({
  originalText,
  translations,
  onSave,
}: TranslationCardProps) {
  useEffect(() => {
    console.log("✅ useEffect 감지됨 - 업데이트된 translations:", translations);
  }, [translations]);

  // ✅ 하이라이트 상태를 주석 처리하여 제거
  // const [highlightEnabled, setHighlightEnabled] = useState(true);

  // ✅ 하이라이트 기능 비활성화
  // const highlightedTexts = highlightEnabled
  //   ? highlightDifferences(originalText, [
  //       translations.google,
  //       translations.papago,
  //       translations.deepL,
  //     ])
  //   : [translations.google, translations.papago, translations.deepL];

  return (
    <div className="w-full border p-4 rounded-lg">
      <h3 className="text-lg font-semibold">원본 문장</h3>
      <p>{originalText}</p>

      {/* ✅ 하이라이트 버튼 주석 처리 */}
      {/* <button
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => setHighlightEnabled(!highlightEnabled)}
      >
        {highlightEnabled ? "하이라이트 끄기" : "하이라이트 켜기"}
      </button> */}

      <h3 className="text-lg font-semibold">번역 결과</h3>
      <div className="grid grid-cols-3 gap-4">
        {["Google", "Papago", "DeepL"].map((provider, index) => (
          <div key={provider} className="border p-2">
            <strong>{provider}:</strong>
            <p className="p-2">
              {/* {highlightedTexts[index]} */}
              {
                translations[
                  provider.toLowerCase() as keyof typeof translations
                ]
              }
            </p>
            <button
              className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
              onClick={() =>
                onSave(
                  originalText,
                  provider === "DeepL"
                    ? translations["deepL"]
                    : translations[
                        provider.toLowerCase() as keyof typeof translations
                      ]
                )
              }
            >
              저장하기
            </button>
          </div>
        ))}
      </div>
      {console.log("📌 TranslationCard에 전달된 translations:", translations)}
    </div>
  );
}
