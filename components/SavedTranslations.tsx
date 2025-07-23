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
  // 화면에 표시할 번호 포함 텍스트
  const numberedText = savedTranslations
    .map((t, i) => `#${i + 1}_ ${t.translated}`)
    .join("\n");

  const [editText, setEditText] = useState(numberedText);
  const [showToast, setShowToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [toastMessage, setToastMessage] = useState("");
  const { resetAllTranslations, setSavedTranslations } = useTranslation();

  useEffect(() => {
    setEditText(
      savedTranslations.map((t, i) => `#${i + 1}_ ${t.translated}`).join("\n")
    );
  }, [savedTranslations]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [editText]);

  const handleDownloadTxt = () => {
    const rawText = extractCleanText(editText);
    const blob = new Blob([rawText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translations.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const extractCleanText = (text: string) => {
    return text
      .split("\n")
      .map((line) => line.replace(/^#\d+_ /, "").trim())
      .join("\n");
  };

  const handleSave = () => {
    if (savedTranslations.length === 0) {
      setEditText("");
      return;
    }

    // 1. textarea에서 번역만 추출
    const updatedTranslations = extractCleanText(editText)
      .split("\n")
      .filter((text) => text.trim() !== "");

    // 2. 기존 savedTranslations의 original과 매칭하여, 남은 번역만 배열로 재구성
    //    (순서가 바뀌지 않는다는 전제)
    //    줄이 줄어들면 해당 번역 삭제, 줄이 늘어나도 추가하지 않음
    const newSavedTranslations = savedTranslations
      .slice(0, updatedTranslations.length)
      .map((item, idx) => ({
        original: item.original,
        translated: updatedTranslations[idx],
      }));

    setSavedTranslations(newSavedTranslations);
    showToastMessage("번역이 저장되었습니다.");
  };

  const handleResetTranslations = () => {
    const isConfirmed = window.confirm("정말 초기화할까요?");
    if (!isConfirmed) return;

    resetAllTranslations();
    setTimeout(() => setEditText(""), 0);
    showToastMessage("번역이 초기화되었습니다.");
  };

  const handleCopyAll = () => {
    const rawText = extractCleanText(editText);
    navigator.clipboard.writeText(rawText).then(() => {
      showToastMessage("클립보드에 복사되었습니다.");
    });
  };

  return (
    <div className="w-full rounded-lg mt-4 text-black">
      {/* 제목 */}
      <h2 className="text-lg font-semibold mb-1">저장된 번역</h2>

      {/* 안내 문구 */}
      <p className="text-sm text-red-500 mb-2">
        주의: 번역 결과는 브라우저에 임시 저장됩니다.
        <br />
        캐시/쿠키 삭제 시 내용이 지워지니 필요시 백업해주세요.
      </p>

      {/* 버튼 줄 */}
      <div className="flex gap-2 mb-2">
        <button
          className="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium shadow-none hover:bg-gray-100 transition"
          onClick={handleCopyAll}
        >
          전체 복사
        </button>
        <button
          className="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium shadow-none hover:bg-gray-100 transition"
          onClick={handleResetTranslations}
        >
          초기화
        </button>
        <button
          className="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium shadow-none hover:bg-gray-100 transition"
          onClick={handleDownloadTxt}
        >
          다운로드
        </button>
      </div>

      {/* 텍스트 박스 */}
      <div className="border border-gray-300 bg-white p-4 rounded-xl shadow-inner text-black">
        <textarea
          ref={textareaRef}
          className="w-full h-96 text-black p-2 rounded resize-none leading-6 overflow-y-auto "
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

      {/* Toast 메시지 */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default SavedTranslations;
