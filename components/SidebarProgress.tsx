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
  // 전체 문장 중 완료된 문장의 비율 계산
  const progressPercentage = (completedIndexes.size / totalSentences) * 100;

  return (
    <div className="p-4 pb-7 border-b bg-white">
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
