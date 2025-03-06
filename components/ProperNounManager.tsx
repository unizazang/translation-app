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
    console.log("📌 추가된 고유명사:", { original, translation });
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">🔹 고유명사 관리</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="원본"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="번역"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          추가
        </button>
      </div>

      <ul className="space-y-2">
        {properNouns.map((noun) => (
          <li
            key={noun.original}
            className="flex justify-between items-center p-2 border rounded bg-gray-50"
          >
            <span className="text-gray-700">
              {noun.original} -> {noun.translation}
            </span>
            <button
              onClick={() => removeProperNoun(noun.original)}
              className="text-red-500 hover:text-red-700 transition"
            >
              ❌ 삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
