"use client";

interface TranslationResultProps {
  text: string;
}

export default function TranslationResult({ text }: TranslationResultProps) {
  return (
    <div className="w-full max-w-2xl border p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">추출된 문장</h2>
      <pre className="whitespace-pre-wrap">{text}</pre>
    </div>
  );
}
