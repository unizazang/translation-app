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
    <div className="w-full border-gray-500 p-10 rounded-lg bg-white text-center">
      <h3 className="text-lg font-semibold mb-5 ">원본 문장</h3>
      <p className="">{originalText}</p>

      <h3 className="text-lg font-semibold mt-10 border-t border-gray-300 pt-10 pb-10">
        번역 결과
      </h3>
      <div className="grid grid-cols-3 gap-4 space-y-4 mt-4 text-center ">
        <div className=" border border-gray-300 bg-white p-4 rounded-xl shadow-lg flex flex-col h-full">
          <strong className="block text-gray-700   m-3  text-lg">Google</strong>
          <p className="p-2 m-2">{translations.google}</p>
          <button
            className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
            onClick={() => onSave(translations.google)}
          >
            저장하기
          </button>
        </div>
        <div className="border border-gray-300 bg-white p-4 rounded-xl  text-center  shadow-lg flex flex-col h-full">
          <strong className="block text-gray-700   m-3  text-lg">Papago</strong>
          <p className="p-2 m-2">{translations.papago}</p>
          <button
            className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
            onClick={() => onSave(translations.papago)}
          >
            저장하기
          </button>
        </div>
        <div className="border border-gray-300 bg-white p-4 rounded-xl  text-center  shadow-lg flex flex-col h-full">
          <strong className="block text-gray-700 m-3 text-lg">DeepL</strong>
          <p className="p-2 m-2">{translations.deepL}</p>
          <button
            className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
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
