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
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import FileDropzone from "./FileDropzone";

export default function ProperNounManager() {
  const {
    properNouns,
    addProperNoun,
    removeProperNoun,
    addProperNounsFromFile,
    resetAllProperNouns,
  } = useProperNoun();
  const [original, setOriginal] = useState("");
  const [translation, setTranslation] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleAdd = () => {
    addProperNoun(original, translation);
    setOriginal("");
    setTranslation("");
    console.log("📌 추가된 고유명사:", { original, translation });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        addProperNounsFromFile(e.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleResetProperNouns = () => {
    const isConfirmed = window.confirm("정말 초기화할까요?");
    if (!isConfirmed) return;
    resetAllProperNouns();
    alert("🔄 모든 고유명사가 초기화되었습니다.");
  };

  return (
    <div className="px-6 rounded-lg bg-white text-black">
      <h2 className="text-lg font-semibold mb-4">🔹 번역 예외 단어 설정</h2>

      <p className="text-gray-600 mb-2">
        번역되지 않도록 할 단어나, 특정 방식으로 번역하고 싶은 단어를 설정할 수
        있습니다.
      </p>

      
      {/* ✅ 첫 줄: 입력 + 버튼을 가로로 정렬 */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="번역되지 않도록 할 단어"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-blue-400 text-white rounded hover:bg-blue-600 transition whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faPlus} /> 단어 추가
        </button>
      </div>

      {/* ✅ 두 번째 줄: 원하는 번역 */}
      <input
        type="text"
        placeholder="원하는 번역"
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
        className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* ✅ 파일 업로드 영역 */}
      <div className="mb-4">
        <FileDropzone
          onFileAccepted={handleFileUpload}
          accept={{ "text/plain": [".txt"] }}
          fileType="txt"
          maxSize={5 * 1024 * 1024}
        />
      </div>

      {/* ✅ 버튼 2개: 다운로드/초기화 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            const blob = new Blob(
              [properNouns.map((n) => `${n.original} -> ${n.translation}`).join("\n")],
              { type: "text/plain;charset=utf-8" }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "proper_nouns.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex-1 p-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          단어 목록 다운로드
        </button>
        <button
          onClick={handleResetProperNouns}
          className="flex-1 p-2 bg-red-400 text-white rounded hover:bg-red-600 transition cursor-pointer"
        >
          <FontAwesomeIcon icon={faEraser} /> 단어 목록 초기화
        </button>
      </div>

      {/* 안내 문구 */}
      <p className="text-sm  text-gray-500 mt-2 border-t pt-2 border-gray-300">
        단어 추가 시 Ctrl+R로 새로고침 한 뒤 번역해주세요.
      </p>


      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
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

      {isOpen && (
        <div className="mt-4 border rounded p-2 bg-gray-50 max-h-45 overflow-y-auto text-black">
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
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="cursor-pointer"
                    />{" "}
                    삭제
                  </button>
                </li>
              ))
            ) : (
              <p className="text-black">번역하지 않을 단어를 등록해 보세요.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
