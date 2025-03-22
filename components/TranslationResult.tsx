"use client";

import { TranslatedTextBlock } from "@/lib/pdfLayout"; // ✅ 올바르게 export된 타입 사용

interface TranslationResultProps {
  translatedBlocks: TranslatedTextBlock[];
}

export default function TranslationResult({
  translatedBlocks,
}: TranslationResultProps) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold">번역 결과</h2>
      <div className="mt-2 space-y-2">
        {translatedBlocks.map((block, index) => (
          <div key={index} className="p-2 border rounded bg-white shadow">
            <p className="text-gray-800">{block.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
