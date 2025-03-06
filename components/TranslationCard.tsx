"use client";

import { useEffect, useState } from "react";

interface TranslationCardProps {
  originalText: string;
  translations: { google: string; papago: string; deepL: string };
  onSave: (translation: string) => void;
}

export default function TranslationCard({
  originalText,
  translations,
  onSave,
}: TranslationCardProps) {
  useEffect(() => {
    // console.log("✅ useEffect 감지됨 - 업데이트된 translations:", translations);
  }, [translations]);

  return (
    <div className="w-full border p-4 rounded-lg">
      <h3 className="text-lg font-semibold">원본 문장</h3>
      <p>{originalText}</p>

      <h3 className="text-lg font-semibold">번역 결과</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-2">
          <strong>Google:</strong>
          <p className="p-2">{translations.google}</p>
          <button
            className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
            onClick={() => onSave(translations.google)}
          >
            저장하기
          </button>
        </div>
        <div className="border p-2">
          <strong>Papago:</strong>
          <p className="p-2">{translations.papago}</p>
          <button
            className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
            onClick={() => onSave(translations.papago)}
          >
            저장하기
          </button>
        </div>
        <div className="border p-2">
          <strong>DeepL:</strong>
          <p className="p-2">{translations.deepL}</p>
          <button
            className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
            onClick={() => onSave(translations.deepL)}
          >
            저장하기
          </button>
        </div>
      </div>
      {/* {console.log("📌 TranslationCard에 전달된 translations:", translations)} */}
    </div>
  );
}
