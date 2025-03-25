"use client";

import React from "react";

interface SidebarProgressProps {
  totalPages: number;
  currentPage: number;
  currentIndex: number;
  totalSentences: number;
  currentSentenceInPage: number;
}

const SidebarProgress: React.FC<SidebarProgressProps> = ({
  totalPages,
  currentPage,
  currentIndex,
  totalSentences,
  currentSentenceInPage,
}) => {
  return (
    <div className="p-4 pb-7 border-b bg-white">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          페이지 {currentPage} / {totalPages}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {currentSentenceInPage} / {totalSentences} 문장
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${(currentSentenceInPage / totalSentences) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default SidebarProgress;
