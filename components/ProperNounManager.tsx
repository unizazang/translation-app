"use client";

import { useState } from "react";
import { useProperNoun } from "@/hooks/useProperNoun";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faFileUpload,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

export default function ProperNounManager() {
  const { properNouns, addProperNoun, removeProperNoun, addProperNounsFromFile } =
    useProperNoun();
  const [original, setOriginal] = useState("");
  const [translation, setTranslation] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false); // ✅ 아코디언 상태 추가

  const handleAdd = () => {
    addProperNoun(original, translation);
    setOriginal("");
    setTranslation("");
    console.log("📌 추가된 고유명사:", { original, translation });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          addProperNounsFromFile(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white text-black">
      <h2 className="text-lg font-semibold mb-4">🔹 고유명사 관리</h2>

      {/* ✅ 입력 필드는 항상 표시 */}
      <div className="flex gap-2 mb-4 h-3">
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
          <FontAwesomeIcon icon={faPlus} /> 추가
        </button>
      </div>

      {/* ✅ 파일 업로드 버튼 추가 */}
      <input type="file" accept=".txt" onChange={handleFileUpload} className="mt-2" />

      {/* ✅ 아코디언 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
      >
        {isOpen ? (
          <>
            <FontAwesomeIcon icon={faChevronUp} /> 목록 접기
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faChevronDown} /> 목록 펼치기
          </>
        )}
      </button>

      {/* ✅ 고유명사 목록 (아코디언 적용) */}
      {isOpen && (
        <ul className="space-y-2 mt-4">
          {properNouns.length > 0 ? (
            properNouns.map((noun) => (
              <li
                key={noun.original}
                className="flex justify-between items-center p-2 border border-gray-300"
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
            <p className="text-black">등록된 고유명사가 없습니다.</p>
          )}
        </ul>
      )}
    </div>
  );
}
