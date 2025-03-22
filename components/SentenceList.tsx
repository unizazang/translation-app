"use client";

import { useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faForward,
  faStar as faStarSolid,
  faStar as faStarRegular,
  faClock,
  faStar,
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

type FilterType =
  | "all"
  | "translated"
  | "skipped"
  | "starred"
  | "pending"
  | "none";

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

  const getSentenceStatus = (index: number) => {
    if (translatedIndexes.has(index)) return "translated";
    if (skippedIndexes.has(index)) return "skipped";
    if (index === currentIndex) return "pending";
    return "none";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "translated":
        return <FontAwesomeIcon icon={faCheck} className="text-green-500" />;
      case "skipped":
        return <FontAwesomeIcon icon={faForward} className="text-gray-500" />;
      case "pending":
        return <FontAwesomeIcon icon={faClock} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="문장 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체</option>
          <option value="translated">번역됨</option>
          <option value="skipped">건너뜀</option>
          <option value="pending">대기중</option>
          <option value="none">미처리</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {filteredSentences.map((sentence, index) => {
            const status = getSentenceStatus(index);
            return (
              <li
                key={index}
                onClick={() => handleSentenceClick(index)}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors
                  ${
                    index === currentIndex
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50 border border-gray-200"
                  }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                    <span className="text-gray-700">
                      {truncateText(sentence.text)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarClick(e, index);
                    }}
                    className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                      starredIndexes.has(index)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
