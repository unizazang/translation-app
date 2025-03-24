"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface SavedTranslationsProps {
  savedTranslations: {
    original: string;
    translated: string;
  }[];
  onCopyAll: () => void;
  updateTranslation: (index: number, newTranslation: string) => void;
}

const SavedTranslations: React.FC<SavedTranslationsProps> = ({
  savedTranslations,
  onCopyAll,
  updateTranslation,
}) => {
  const [editText, setEditText] = useState(
    savedTranslations.map((t) => t.translated).join("\n")
  );
  const [showToast, setShowToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [toastMessage, setToastMessage] = useState("");
  const { resetAllTranslations } = useTranslation();

  // 저장된 번역이 변경될 때 textarea 업데이트
  useEffect(() => {
    setEditText(savedTranslations.map((t) => t.translated).join("\n"));
  }, [savedTranslations]);

  // 저장된 번역이 추가될 때 textarea의 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [editText]);

  // TXT 파일로 저장하는 함수
  const handleDownloadTxt = () => {
    const blob = new Blob([editText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translations.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Toast 메시지를 표시하는 함수
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSave = () => {
    if (savedTranslations.length === 0) {
      setEditText("");
      return;
    }

    const updatedTranslations = editText
      .split("\n")
      .filter((text) => text.trim() !== "");
    updatedTranslations.forEach((text, index) => {
      updateTranslation(index, text);
    });
    console.log("📌 저장된 번역 업데이트됨:", updatedTranslations);
    showToastMessage("번역이 저장되었습니다.");
  };

  // 번역 초기화 함수
  const handleResetTranslations = () => {
    const isConfirmed = window.confirm("정말 초기화할까요?");
    if (!isConfirmed) return;

    resetAllTranslations();
    setTimeout(() => setEditText(""), 0);

    console.log("🔄 모든 번역이 초기화되었습니다.");
    showToastMessage("번역이 초기화되었습니다.");
  };

  // 클립보드에 텍스트를 복사하는 함수
  const handleCopyAll = () => {
    navigator.clipboard.writeText(editText).then(() => {
      showToastMessage("클립보드에 복사되었습니다.");
    });
  };

  return (
    <div className="w-full rounded-lg mt-4 text-black">
      <h2 className="text-xl font-semibold">저장된 번역</h2>

      {/* 전체 복사 버튼 */}
      <button
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
        onClick={handleCopyAll}
      >
        전체 복사
      </button>
      <button
        className="px-3 ml-2 py-1 bg-red-400 cursor-pointer hover:bg-red-600 text-white rounded-md"
        onClick={handleResetTranslations}
      >
        초기화
      </button>

      {/* textarea 내부에서 스크롤 가능하도록 설정 */}
      <div className="mt-4 border border-gray-300 bg-white p-4 rounded-xl shadow-lg text-black">
        <textarea
          ref={textareaRef}
          className="w-full h-96 text-black p-2 rounded resize-none overflow-y-auto"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
          }}
        />
      </div>

      {/* 저장 버튼 */}
      <div className="flex gap-2 mt-2">
        <button
          className="mt-2 px-3 py-1 bg-green-600 text-white cursor-pointer rounded-md"
          onClick={handleSave}
        >
          브라우저 저장
        </button>

        <button
          className="mt-2 px-3 py-1 bg-gray-700 text-white cursor-pointer rounded-md"
          onClick={handleDownloadTxt}
        >
          txt로 저장
        </button>
      </div>

      {/* Toast 메시지 */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-400 bg-opacity-75 text-white px-6 py-3 rounded-full animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default SavedTranslations;
