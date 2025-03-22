"use client";

import { useState } from "react";

interface SentenceListProps {
  sentences: string[][];
  currentIndex: number;
  translatedIndexes: Set<number>;
  skippedIndexes: Set<number>;
  starredIndexes: Set<number>;
  onSentenceSelect: (index: number) => void;
  onToggleStar: (index: number) => void;
}

export default function SentenceList({
  sentences,
  currentIndex,
  translatedIndexes,
  skippedIndexes,
  starredIndexes,
  onSentenceSelect,
  onToggleStar,
}: SentenceListProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<
    "all" | "translated" | "skipped" | "starred"
  >("all");

  const filteredSentences = sentences
    .map((sentence, index) => ({
      id: index,
      text: sentence.join(" "),
      isTranslated: translatedIndexes.has(index),
      isSkipped: skippedIndexes.has(index),
      isStarred: starredIndexes.has(index),
    }))
    .filter((sentence) => {
      if (
        searchQuery &&
        !sentence.text.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      switch (filter) {
        case "translated":
          return sentence.isTranslated;
        case "skipped":
          return sentence.isSkipped;
        case "starred":
          return sentence.isStarred;
        default:
          return true;
      }
    });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="문장 검색..."
          className="w-full px-3 py-2 border rounded mb-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="w-full px-3 py-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">전체 보기</option>
          <option value="translated">번역 완료</option>
          <option value="skipped">건너뛴 문장</option>
          <option value="starred">중요 표시</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredSentences.map(
          ({ id, text, isTranslated, isSkipped, isStarred }) => (
            <div
              key={id}
              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                currentIndex === id ? "bg-blue-50" : ""
              }`}
              onClick={() => onSentenceSelect(id)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">#{id + 1}</span>
                <div className="flex gap-1">
                  {isTranslated && <span title="번역 완료">✅</span>}
                  {isSkipped && <span title="건너뛰기">⏩</span>}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStar(id);
                    }}
                    className="hover:text-yellow-500"
                  >
                    {isStarred ? "⭐" : "☆"}
                  </button>
                </div>
              </div>
              <p className="text-sm line-clamp-2">{text}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
