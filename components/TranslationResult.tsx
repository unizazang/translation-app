"use client";

import { TranslatedTextBlock } from "@/lib/pdfLayout"; // ✅ 올바르게 export된 타입 사용

interface TranslationResultProps {
  translatedBlocks: TranslatedTextBlock[];
  onTranslationChange: (value: string) => void;
}

export default function TranslationResult({
  translatedBlocks,
  onTranslationChange,
}: TranslationResultProps) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold">번역 결과</h2>
      <div className="mt-2 space-y-2">
        {translatedBlocks.map((block, index) => (
          <div key={index} className="p-2 border rounded bg-white shadow">
            <p className="text-gray-800">{block.text}</p>
            <textarea
              value={block.translatedText}
              onChange={(e) => onTranslationChange(e.target.value)}
              className="mt-2 w-full p-2 border rounded"
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
