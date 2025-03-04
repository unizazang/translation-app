"use client";

import { useState } from "react";
import { useProperNoun } from "@/hooks/useProperNoun";

export default function ProperNounManager() {
  const { properNouns, addProperNoun, removeProperNoun } = useProperNoun();
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">🔹 고유명사 관리</h2>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="고유명사 입력"
          className="border p-2 rounded"
        />
        <button
          onClick={() => {
            addProperNoun(inputValue);
            setInputValue(""); // 입력 후 초기화
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          추가
        </button>
      </div>

      <ul className="mt-3 space-y-1">
        {properNouns.map((noun, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>{noun}</span>
            <button
              onClick={() => removeProperNoun(noun)}
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
