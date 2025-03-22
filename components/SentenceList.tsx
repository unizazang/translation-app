"use client";

import { useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faForward,
  faStar as faStarSolid,
  faStar as faStarRegular,
} from "@fortawesome/free-solid-svg-icons";

interface SentenceListProps {
  sentences: string[][];
  currentIndex: number;
  translatedIndexes: Set<number>;
  skippedIndexes: Set<number>;
  starredIndexes: Set<number>;
  onSentenceSelect: (index: number) => void;
  onToggleStar: (index: number) => void;
}

type FilterType = "all" | "translated" | "skipped" | "starred";

// 문장을 축약하는 함수
const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export default function SentenceList({
  sentences,
  currentIndex,
  translatedIndexes,
  skippedIndexes,
  starredIndexes,
  onSentenceSelect,
  onToggleStar,
}: SentenceListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // 검색어 변경 핸들러
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  // 필터 변경 핸들러
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilter(e.target.value as FilterType);
    },
    []
  );

  // 필터링된 문장 목록 계산
  const filteredSentences = useMemo(() => {
    return sentences
      .map((sentence, index) => ({
        text: sentence.join(" "),
        index,
        isTranslated: translatedIndexes.has(index),
        isSkipped: skippedIndexes.has(index),
        isStarred: starredIndexes.has(index),
      }))
      .filter((sentence) => {
        // 검색어 필터링
        const matchesSearch = sentence.text
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        // 상태 필터링
        let matchesFilter = true;
        switch (filter) {
          case "translated":
            matchesFilter = sentence.isTranslated;
            break;
          case "skipped":
            matchesFilter = sentence.isSkipped;
            break;
          case "starred":
            matchesFilter = sentence.isStarred;
            break;
        }

        return matchesSearch && matchesFilter;
      });
  }, [
    sentences,
    searchQuery,
    filter,
    translatedIndexes,
    skippedIndexes,
    starredIndexes,
  ]);

  // 문장 선택 핸들러
  const handleSentenceClick = useCallback(
    (index: number) => {
      onSentenceSelect(index);
    },
    [onSentenceSelect]
  );

  // 중요 표시 토글 핸들러
  const handleStarClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      onToggleStar(index);
    },
    [onToggleStar]
  );

  return (
    <div className="h-full flex flex-col">
      {/* 검색 및 필터 영역 */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="문장 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded mb-2"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="all">전체</option>
          <option value="translated">번역 완료</option>
          <option value="skipped">건너뛰기</option>
          <option value="starred">중요 표시</option>
        </select>
      </div>

      {/* 문장 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredSentences.map((sentence) => (
          <div
            key={sentence.index}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
              currentIndex === sentence.index ? "bg-blue-50" : ""
            }`}
            onClick={() => handleSentenceClick(sentence.index)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  {sentence.index + 1}번째 문장
                </p>
                <p className="text-sm">{truncateText(sentence.text)}</p>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={sentence.isTranslated ? faCheck : faCheck}
                  className={`text-lg ${
                    sentence.isTranslated ? "text-green-500" : "text-gray-300"
                  }`}
                />
                <FontAwesomeIcon
                  icon={faForward}
                  className={`text-lg ${
                    sentence.isSkipped ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
                <button
                  onClick={(e) => handleStarClick(e, sentence.index)}
                  className="text-lg"
                >
                  <FontAwesomeIcon
                    icon={sentence.isStarred ? faStarSolid : faStarRegular}
                    className={
                      sentence.isStarred ? "text-yellow-500" : "text-gray-300"
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
