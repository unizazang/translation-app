"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faForward,
  faClock,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import ContextMenu from "./ContextMenu";

interface SentenceListProps {
  groupedSentences: string[][];
  currentIndex: number;
  translatedIndexes: Set<number>;
  skippedIndexes: Set<number>;
  starredIndexes: Set<number>;
  onSentenceSelect: (index: number) => void;
  onToggleStar: (index: number) => void;
  onMarkAsReviewed: (indexes: number[]) => void;
}

type FilterType =
  | "all"
  | "translated"
  | "skipped"
  | "starred"
  | "pending"
  | "bookmarked";

// 문장을 축약하는 함수
const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export default function SentenceList({
  groupedSentences,
  currentIndex,
  translatedIndexes,
  skippedIndexes,
  starredIndexes,
  onSentenceSelect,
  onToggleStar,
  onMarkAsReviewed,
}: SentenceListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedSentences, setSelectedSentences] = useState<Set<number>>(
    new Set()
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    index: number;
  } | null>(null);

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

  // 체크박스 선택 핸들러
  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      e.stopPropagation();
      setSelectedSentences((prev) => {
        const newSet = new Set(prev);
        if (e.target.checked) {
          newSet.add(index);
        } else {
          newSet.delete(index);
        }
        return newSet;
      });
    },
    []
  );

  // 우클릭 핸들러
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      if (skippedIndexes.has(index)) {
        setContextMenu({ x: e.clientX, y: e.clientY, index });
      }
    },
    [skippedIndexes]
  );

  // 일괄 검토 완료 핸들러
  const handleBulkMarkAsReviewed = useCallback(() => {
    if (selectedSentences.size > 0) {
      onMarkAsReviewed(Array.from(selectedSentences));
      setSelectedSentences(new Set());
    }
  }, [selectedSentences, onMarkAsReviewed]);

  // 필터링된 문장 목록 계산
  const filteredSentences = useMemo(() => {
    return groupedSentences
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
          case "bookmarked":
            matchesFilter = sentence.isStarred;
            break;
        }

        return matchesSearch && matchesFilter;
      });
  }, [
    groupedSentences,
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

  // 현재 문장으로 자동 스크롤
  useEffect(() => {
    const currentSentence = document.querySelector(
      `[data-index="${currentIndex}"]`
    );
    if (currentSentence) {
      currentSentence.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentIndex]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="문장 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체</option>
          <option value="translated">번역됨</option>
          <option value="skipped">건너뜀</option>
          <option value="pending">대기중</option>
          <option value="bookmarked">북마크</option>
        </select>
        {selectedSentences.size > 0 && (
          <button
            onClick={handleBulkMarkAsReviewed}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition whitespace-nowrap"
          >
            일괄 검토 완료 ({selectedSentences.size})
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 h-[calc(100vh-12rem)]">
        <ul className="space-y-2">
          {filteredSentences.map((sentence, index) => {
            const status = getSentenceStatus(index);
            return (
              <li
                key={index}
                data-index={index}
                onClick={() => handleSentenceClick(index)}
                onContextMenu={(e) => handleContextMenu(e, index)}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors
                  ${
                    index === currentIndex
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50 border border-gray-200"
                  }`}
              >
                {skippedIndexes.has(index) && (
                  <input
                    type="checkbox"
                    checked={selectedSentences.has(index)}
                    onChange={(e) => handleCheckboxChange(e, index)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                )}
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
                    onClick={(e) => handleStarClick(e, index)}
                    className={`absolute -top-2 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors ${
                      starredIndexes.has(index)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faBookmark}
                      className={`text-xl transform rotate-12 ${
                        starredIndexes.has(index) ? "scale-110" : "scale-100"
                      } transition-transform duration-200`}
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onMarkAsReviewed={() => {
            onMarkAsReviewed([contextMenu.index]);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
