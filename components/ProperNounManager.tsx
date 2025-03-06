"use client";

import { useState } from "react";
import { useProperNoun } from "@/hooks/useProperNoun";

export default function ProperNounManager() {
  const { properNouns, addProperNoun, removeProperNoun } = useProperNoun();
  const [original, setOriginal] = useState("");
  const [translation, setTranslation] = useState("");

  const handleAdd = () => {
    addProperNoun(original, translation);
    setOriginal("");
    setTranslation("");
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">🔹 고유명사 관리</h2>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="원본"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="번역"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          추가
        </button>
      </div>

      <ul className="mt-3 space-y-1">
        {properNouns.map((noun) => (
          <li
            key={noun.original}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>
              {noun.original} -> {noun.translation}
            </span>
            <button
              onClick={() => removeProperNoun(noun.original)}
              className="text-red-500"
            >
              ❌ 삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
