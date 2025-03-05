"use client";

import { useState } from "react";
import {
  testGoogleTranslate,
  testPapagoTranslate,
  testDeepLTranslate,
} from "@/lib/translationApi";
import {
  addInvisibleCharacters,
  removeInvisibleCharacters,
} from "@/lib/properNounHandler";

export default function TestTranslationPage() {
  const [inputText, setInputText] = useState("Dracula is a powerful vampire.");
  const [translatedTexts, setTranslatedTexts] = useState({
    google: "",
    papago: "",
    deepL: "",
  });

  const handleTranslate = async () => {
    const protectedText = addInvisibleCharacters(inputText);

    const [googleResult, papagoResult, deepLResult] = await Promise.all([
      testGoogleTranslate(protectedText, "en", "ko"),
      testPapagoTranslate(protectedText, "en", "ko"),
      testDeepLTranslate(protectedText, "EN", "KO"),
    ]);

    setTranslatedTexts({
      google: googleResult
        ? removeInvisibleCharacters(googleResult)
        : "번역 실패",
      papago: papagoResult
        ? removeInvisibleCharacters(papagoResult)
        : "번역 실패",
      deepL: deepLResult ? removeInvisibleCharacters(deepLResult) : "번역 실패",
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">🛠 번역 API 테스트</h1>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={3}
      />

      <button
        onClick={handleTranslate}
        className="px-4 py-2 bg-blue-500 text-white rounded w-full"
      >
        번역 테스트 실행
      </button>

      <div className="mt-4">
        <h2 className="font-semibold">🔹 Google 번역 결과:</h2>
        <p className="border p-2 rounded bg-gray-100">
          {translatedTexts.google}
        </p>

        <h2 className="font-semibold mt-2">🔹 Papago 번역 결과:</h2>
        <p className="border p-2 rounded bg-gray-100">
          {translatedTexts.papago}
        </p>

        <h2 className="font-semibold mt-2">🔹 DeepL 번역 결과:</h2>
        <p className="border p-2 rounded bg-gray-100">
          {translatedTexts.deepL}
        </p>
      </div>
    </div>
  );
}
