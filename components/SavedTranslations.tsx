"use client";

import { useState } from "react";

interface SavedTranslationsProps {
  savedTranslations: string[];
  onCopyAll: () => void;
  updateTranslation: (index: number, newText: string) => void;
}

export default function SavedTranslations({
  savedTranslations,
  onCopyAll,
  updateTranslation,
}: SavedTranslationsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  return (
    <div className="w-full border p-4 rounded-lg mt-4">
      <h2 className="text-xl font-semibold">저장된 번역</h2>
      <button
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
        onClick={onCopyAll}
      >
        전체 복사
      </button>

      {/* ✅ 스크롤 가능하도록 스타일 적용 */}
      <div className="mt-4 max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
        {savedTranslations.length === 0 ? (
          <p className="text-gray-500 text-center">저장된 번역이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {savedTranslations.map((entry, index) => (
              <li
                key={index}
                className="border p-2 rounded bg-white hover:bg-gray-100 transition"
              >
                {editingIndex === index ? (
                  <textarea
                    className="w-full p-1 border rounded resize-none"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => {
                      updateTranslation(index, editText);
                      setEditingIndex(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        updateTranslation(index, editText);
                        setEditingIndex(null);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <pre
                    className="whitespace-pre-wrap cursor-pointer"
                    onClick={() => {
                      setEditingIndex(index);
                      setEditText(entry);
                    }}
                  >
                    {entry}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
