"use client";

import React from "react";

interface SidebarProgressProps {
  totalPages: number;
  currentPage: number;
  currentIndex: number;
  totalSentences: number;
}

const SidebarProgress: React.FC<SidebarProgressProps> = ({
  totalPages,
  currentPage,
  currentIndex,
  totalSentences,
}) => {
  // 현재 페이지의 시작과 끝 인덱스 계산
  const currentPageStartIndex = (currentPage - 1) * 10;
  const currentPageEndIndex = Math.min(
    currentPageStartIndex + 10,
    totalSentences
  );
  const currentPageSize = currentPageEndIndex - currentPageStartIndex;

  // 현재 페이지 내 현재 문장 위치 계산
  const currentPageCurrentSentence = currentIndex - currentPageStartIndex + 1;

  return (
    <div className="p-4 pb-7 border-b bg-white">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          페이지 {currentPage} / {totalPages}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {currentPageCurrentSentence} / {currentPageSize} 문장
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${(currentPageCurrentSentence / currentPageSize) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default SidebarProgress;
