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
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <h3>원본 문장</h3>
      <p>{originalText}</p>

      <h3>번역 결과</h3>
      <p>
        <strong>Google:</strong> {translations.google}
      </p>
      <p>
        <strong>Papago:</strong> {translations.papago}
      </p>
      <p>
        <strong>DeepL:</strong> {translations.deepL}
      </p>
    </div>
  );
}
