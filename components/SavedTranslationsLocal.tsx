"use client";

import React, { useState, useRef } from "react";

interface SavedTranslationsProps {
  savedTranslations: {
    idx: number;
    original: string;
    translated: string;
  }[];
  groupedSentences: string[][];
  currentIndex: number;
  onCopyAll: () => void;
  updateTranslation: (idx: number, newTranslation: string) => void; // ✅ 여기!
  onSentenceSelect: (index: number) => void;
}

const SavedTranslationsLocal: React.FC<SavedTranslationsProps> = ({
  savedTranslations,
  groupedSentences,
  currentIndex,
  onCopyAll,
  updateTranslation,
  onSentenceSelect,
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(
    new Set()
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleDownloadTxt = () => {
    const rawText = savedTranslations.map((t) => t.translated).join("\n");
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

  const handleResetTranslations = () => {
    const isConfirmed = window.confirm("정말 초기화할까요?");
    if (!isConfirmed) return;
    localStorage.removeItem("savedTranslations");
    showToastMessage("번역이 초기화되었습니다.");
  };

  const handleCopyAll = () => {
    onCopyAll();
    showToastMessage("클립보드에 복사되었습니다.");
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const target = savedTranslations[editingIndex];
      updateTranslation(target.idx, editingValue.trim());
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const truncateText = (text: string, length = 100) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + " ...";
  };

  return (
    <div className="w-full rounded-lg mt-4 text-black">
      <h2 className="text-lg font-semibold mb-1">저장된 번역</h2>
      <p className="text-sm text-red-500 mb-2">
        주의: 번역 결과는 브라우저에 임시 저장됩니다.
        <br />
        캐시/쿠키 삭제 시 내용이 지워지니 필요시 백업해주세요.
      </p>

      {/* 버튼 줄 */}
      <div className="flex gap-2 mb-2">
        <button className="px-4 py-1.5 border rounded" onClick={handleCopyAll}>
          전체 복사
        </button>
        <button
          className="px-4 py-1.5 border rounded"
          onClick={handleResetTranslations}
        >
          초기화
        </button>
        <button
          className="px-4 py-1.5 border rounded"
          onClick={handleDownloadTxt}
        >
          다운로드
        </button>
      </div>

      {/* 안내 문구 또는 번역 리스트 */}
      {savedTranslations.length === 0 ? (
        <p className="text-gray-400 text-sm text-center mt-4">
          저장된 번역이 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {savedTranslations.map((item, index) => {
            const isExpanded = expandedIndexes.has(index);
            const isEditing = editingIndex === index;
            const isActive = currentIndex === item.idx;

            return (
              <div
                key={index}
                className={`border rounded-xl p-4 transition cursor-pointer ${
                  isActive
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-300 hover:shadow"
                }`}
                onClick={() => {
                  toggleExpand(index);
                  onSentenceSelect(item.idx);
                }}
              >
                <div className="text-xs text-gray-400 mb-1">#{index + 1}</div>

                {isExpanded && isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveEdit();
                      }
                    }}
                    className="w-full text-sm text-gray-800 p-2 border border-gray-300 rounded-md resize-none leading-6"
                    rows={4}
                  />
                ) : isExpanded ? (
                  <div
                    className="text-sm text-gray-800 whitespace-pre-line"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingIndex(index);
                      setEditingValue(item.translated);
                    }}
                  >
                    {item.translated}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 line-clamp-1">
                    {truncateText(item.translated)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default SavedTranslationsLocal;
