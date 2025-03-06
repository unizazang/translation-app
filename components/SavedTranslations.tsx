"use client";

interface SavedTranslationsProps {
  savedTranslations: string[];
  onCopyAll: () => void;
}

export default function SavedTranslations({
  savedTranslations,
  onCopyAll,
}: SavedTranslationsProps) {
  return (
    <div className="w-full border p-4 rounded-lg mt-4">
      <h2 className="text-xl font-semibold">저장된 번역</h2>
      <button
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
        onClick={onCopyAll}
      >
        전체 복사
      </button>
      <ul className="mt-4 space-y-2">
        {savedTranslations.map((entry, index) => (
          <li key={index} className="border p-2 rounded bg-gray-100">
            <pre className="whitespace-pre-wrap">&nbsp; {entry}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
