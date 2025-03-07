"use client";

import { useState, useEffect, useRef } from "react";

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
  const [editText, setEditText] = useState(savedTranslations.join("\n"));
  const [showToast, setShowToast] = useState(false); // Toast 메시지 상태 추가
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ✅ 저장된 번역이 변경될 때 textarea 업데이트
  useEffect(() => {
    setEditText(savedTranslations.join("\n"));
  }, [savedTranslations]);

  // ✅ 저장된 번역이 추가될 때 textarea의 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [editText]); // 🔹 `editText`가 변경될 때 스크롤을 내림

  // ✅ 수정된 번역을 저장하는 함수
  const handleSave = () => {
    const updatedTranslations = editText.split("\n");
    updatedTranslations.forEach((text, index) => {
      updateTranslation(index, text); // ✅ 수정 내용 저장
    });
    console.log("📌 저장된 번역 업데이트됨:", updatedTranslations);
  };

  // ✅ 클립보드에 텍스트를 복사하는 함수
  const handleCopyAll = () => {
    navigator.clipboard.writeText(editText).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000); // 2초 후 Toast 메시지 숨기기
    });
  };

  return (
    <div className="w-full border p-4 rounded-lg mt-4">
      <h2 className="text-xl font-semibold">저장된 번역</h2>

      {/* ✅ 전체 복사 버튼 */}
      <button
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
        onClick={handleCopyAll} // ✅ 전체 복사 함수 호출
      >
        전체 복사
      </button>

      {/* ✅ textarea 내부에서 스크롤 가능하도록 설정 */}
      <div className="mt-4 border rounded p-2 bg-gray-50">
        <textarea
          ref={textareaRef}
          className="w-full h-48 p-2 border rounded resize-none overflow-y-auto"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave} // ✅ 입력 후 자동 저장
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
          }}
        />
      </div>

      {/* ✅ 저장 버튼 */}
      <button
        className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
        onClick={handleSave} // ✅ 버튼 클릭 시 저장
      >
        저장하기
      </button>

      {/* ✅ Toast 메시지 */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-400 bg-opacity-75 text-white px-6 py-3 rounded-full animate-bounce">
          클립보드에 복사되었습니다.
        </div>
      )}
    </div>
  );
}
