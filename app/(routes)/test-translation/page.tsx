"use client";

import { useState } from "react";
import {
  testGoogleTranslate,
  testPapagoTranslate,
  testDeepLTranslate,
} from "@/lib/translationApi";
import { addInvisibleCharacters } from "@/lib/properNounHandler";

export default function TestTranslation() {
  const [inputText, setInputText] = useState(
    "The legend of Night's black agents is well-known."
  );
  const [results, setResults] = useState<{
    google: string;
    papago: string;
    deepL: string;
  }>({
    google: "",
    papago: "",
    deepL: "",
  });

  const runTest = async () => {
    const zwnjText = addInvisibleCharacters("Night's black agents");
    const testSentence = inputText.replace("Night's black agents", zwnjText);

    const google = await testGoogleTranslate(testSentence);
    const papago = await testPapagoTranslate(testSentence);
    const deepL = await testDeepLTranslate(testSentence);

    setResults({
      google: google || "",
      papago: papago || "",
      deepL: deepL || "",
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">번역 API 테스트</h1>
      <textarea
        className="border p-2 w-full h-24"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button
        onClick={runTest}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        번역 테스트 실행
      </button>

      <h2 className="mt-4 font-semibold">결과:</h2>
      <p>
        <strong>Google:</strong> {results.google}
      </p>
      <p>
        <strong>Papago:</strong> {results.papago}
      </p>
      <p>
        <strong>DeepL:</strong> {results.deepL}
      </p>
    </div>
  );
}
