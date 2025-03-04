"use client";

interface TranslationCardProps {
  originalText: string;
  translations: { google: string; papago: string; deepL: string };
}

export default function TranslationCard({
  originalText,
  translations,
}: TranslationCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* 원본 문장 */}
      <div className="bg-gray-100 p-4 rounded-lg text-lg font-semibold text-center">
        {originalText}
      </div>

      {/* 번역 결과 (3열 그리드) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Google 번역 */}
        <div className="border p-4 rounded-lg shadow-md bg-white">
          <h3 className="font-bold text-blue-600">Google 번역</h3>
          <p>{translations.google}</p>
        </div>

        {/* Papago 번역 */}
        <div className="border p-4 rounded-lg shadow-md bg-white">
          <h3 className="font-bold text-green-600">Papago 번역</h3>
          <p>{translations.papago}</p>
        </div>

        {/* DeepL 번역 */}
        <div className="border p-4 rounded-lg shadow-md bg-white">
          <h3 className="font-bold text-purple-600">DeepL 번역</h3>
          <p>{translations.deepL}</p>
        </div>
      </div>
    </div>
  );
}
