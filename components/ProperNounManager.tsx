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
  const {
    properNouns,
    addProperNoun,
    removeProperNoun,
    addProperNounsFromFile,
    resetAllProperNouns, // ✅ 추가
  } = useProperNoun();
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

  // ✅ 고유명사 초기화 함수 (Confirm 포함)
  const handleResetProperNouns = () => {
    const isConfirmed = window.confirm("정말 초기화할까요?");
    if (!isConfirmed) return;
    resetAllProperNouns();
    alert("🔄 모든 고유명사가 초기화되었습니다.");
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white text-black">
      <h2 className="text-lg font-semibold mb-4">🔹 고유명사 관리</h2>

      {/* ✅ 입력 필드는 항상 표시 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="원본"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          className="border p-1 rounded w-full flex-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="번역"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="border p-1 rounded w-full  flex-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="p-1 bg-blue-500 flex-1 text-white rounded hover:bg-blue-600 transition"
        >
          <FontAwesomeIcon icon={faPlus} /> 추가
        </button>
      </div>

      {/* ✅ 파일 업로드 버튼 추가 */}
      <input type="file" accept=".txt" onChange={handleFileUpload} className="mt-2" />

      {/* ✅ 초기화 버튼 추가 */}
      <button
        onClick={handleResetProperNouns}
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        초기화
      </button>

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

      {/* ✅ 고유명사 목록 (아코디언 적용 + 스크롤 가능하도록 수정) */}
      {isOpen && (
        <div className="mt-4 border rounded p-2 bg-gray-50 max-h-60 overflow-y-auto">
          <ul className="space-y-2">
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
        </div>
      )}
    </div>
  );
}
