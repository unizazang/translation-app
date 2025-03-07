"use client";

import { useState, useEffect, useRef } from "react";

interface SavedTranslationsProps {
  savedTranslations: string[];
  onCopyAll: () => void;
  updateTranslation: (newText: string) => void;
}

export default function SavedTranslations({
  savedTranslations,
  onCopyAll,
  updateTranslation,
}: SavedTranslationsProps) {
  const [editText, setEditText] = useState(savedTranslations.join("\n"));

  // ✅ textarea의 스크롤을 제어할 ref 생성
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ✅ 저장된 번역이 변경될 때 textarea에도 반영
  useEffect(() => {
    setEditText(savedTranslations.join("\n"));
  }, [savedTranslations]);

  // ✅ 저장된 번역이 추가될 때 textarea의 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [editText]); // 🔹 `editText`가 변경될 때 스크롤을 내림

  return (
    <div className="w-full border p-4 rounded-lg mt-4">
      <h2 className="text-xl font-semibold">저장된 번역</h2>

      {/* ✅ 전체 복사 버튼 */}
      <button
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
        onClick={onCopyAll}
      >
        전체 복사
      </button>

      {/* ✅ textarea 내부에서 스크롤 가능하도록 설정 */}
      <div className="mt-4 border rounded p-2 bg-gray-50">
        <textarea
          ref={textareaRef} // ✅ textarea에 ref 추가
          className="w-full h-48 p-2 border rounded resize-none overflow-y-auto"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      </div>

      {/* ✅ 저장 버튼 추가 */}
      <button
        className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
        style={{ cursor: "pointer", pointerEvents: "auto" }} // ✅ 강제 스타일 적용
        disabled={false} // ✅ 버튼이 항상 활성화되도록 수정
        onClick={() => updateTranslation(editText)}
      >
        저장하기
      </button>
    </div>
  );
}
