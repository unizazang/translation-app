"use client";

import React, { useState } from "react";

interface PageProgressProps {
  currentPage: number;
  totalPages: number;
  currentIndex: number;
  totalSentences: number;
}

const PageProgress: React.FC<PageProgressProps> = ({
  currentPage,
  totalPages,
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
    <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          {currentPageCurrentSentence} / {currentPageSize} 문장
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${(currentPageCurrentSentence / currentPageSize) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default PageProgress;
