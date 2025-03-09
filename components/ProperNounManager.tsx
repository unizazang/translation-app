"use client";

import { useState } from "react";
import { useProperNoun } from "@/hooks/useProperNoun";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

export default function ProperNounManager() {
  const { properNouns, addProperNoun, removeProperNoun } = useProperNoun();
  const [original, setOriginal] = useState("");
  const [translation, setTranslation] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false); // 아코디언 상태 추가

  const handleAdd = () => {
    addProperNoun(original, translation);
    setOriginal("");
    setTranslation("");
    console.log("📌 추가된 고유명사:", { original, translation });
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white  text-black">
      <h2 className="text-lg font-semibold mb-4">🔹 고유명사 관리</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="원본"
          text-black
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          className="border p-2 flex-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="번역"
          text-black
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="border p-2 flex-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          <FontAwesomeIcon icon={faPlus} /> 추가
        </button>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
      >
        {isOpen ? (
          <>
            <FontAwesomeIcon icon={faChevronUp} />
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faChevronDown} />
          </>
        )}
      </button>

      {isOpen && (
        <ul className="space-y-2 mt-4">
          {properNouns.length > 0 ? (
            properNouns.map((noun) => (
              <li
                key={noun.original}
                className="flex justify-between items-center p-2  text-black border border-gray-300"
              >
                <span className="text-gray-700 italic">
                  {`${noun.original} -> ${noun.translation}`}
                </span>
                <button
                  onClick={() => removeProperNoun(noun.original)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FontAwesomeIcon icon={faTrash} /> 삭제
                </button>
              </li>
            ))
          ) : (
            <p className=" text-black">등록된 고유명사가 없습니다.</p>
          )}
        </ul>
      )}
    </div>
  );
}
