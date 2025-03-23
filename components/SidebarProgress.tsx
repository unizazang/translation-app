"use client";

import React from "react";

interface SidebarProgressProps {
  totalPages: number;
  currentPage: number;
  completedIndexes: Set<number>;
  totalSentences: number;
}

const SidebarProgress: React.FC<SidebarProgressProps> = ({
  totalPages,
  currentPage,
  completedIndexes,
  totalSentences,
}) => {
  // 페이지 단위로 완료된 페이지 수 계산
  const completedPages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const pageStartIndex = pageIndex * 10;
    const pageEndIndex = Math.min(pageStartIndex + 10, totalSentences);
    const pageSize = pageEndIndex - pageStartIndex;

    // 해당 페이지의 완료된 문장 수 계산
    const completedInPage = Array.from(completedIndexes).filter(
      (index) => index >= pageStartIndex && index < pageEndIndex
    ).length;

    // 페이지의 문장이 하나라도 완료되었으면 해당 페이지를 완료된 것으로 계산
    return completedInPage > 0;
  }).filter(Boolean).length;

  const progressPercentage = (completedPages / totalPages) * 100;

  return (
    <div className="p-4 border-b bg-white">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          전체 진행률: {progressPercentage.toFixed(1)}%
        </span>
        <span className="text-sm font-medium text-gray-700">
          페이지 {currentPage} / {totalPages}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default SidebarProgress;
