"use client";

import React, { useState } from "react";

interface PageProgressProps {
  currentPage: number;
  totalPages: number;
  currentIndex: number;
  totalSentences: number;
  completedIndexes: Set<number>;
  onProgressBarClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onProgressBarHover: (event: React.MouseEvent<HTMLDivElement>) => void;
  onProgressBarLeave: () => void;
  showTooltip: boolean;
  tooltipText: string;
}

const PageProgress: React.FC<PageProgressProps> = ({
  currentPage,
  totalPages,
  currentIndex,
  totalSentences,
  completedIndexes,
  onProgressBarClick,
  onProgressBarHover,
  onProgressBarLeave,
  showTooltip,
  tooltipText,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // 현재 페이지의 시작과 끝 인덱스 계산
  const currentPageStartIndex = (currentPage - 1) * 10;
  const currentPageEndIndex = Math.min(
    currentPageStartIndex + 10,
    totalSentences
  );
  const currentPageSize = currentPageEndIndex - currentPageStartIndex;

  // 현재 페이지 내 완료된 문장 수 계산
  const completedInPage = Array.from(completedIndexes).filter(
    (index) => index >= currentPageStartIndex && index < currentPageEndIndex
  ).length;

  // 현재 페이지 진행률 계산
  const currentPageProgress =
    currentPageSize > 0
      ? Math.min(Math.round((completedInPage / currentPageSize) * 100), 100)
      : 0;

  // 현재 페이지 내 현재 문장 위치 계산
  const currentPageCurrentSentence = currentIndex - currentPageStartIndex + 1;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // 툴팁 위치 계산
    const tooltipX = Math.max(0, Math.min(rect.width, x));
    const tooltipY = -40; // 진행률 바 위로 40px

    setTooltipPosition({ x: tooltipX, y: tooltipY });
    onProgressBarHover(event);
  };

  return (
    <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          현재 페이지 진행률: {currentPageProgress}%
        </span>
        <span className="text-sm text-gray-600">
          {currentPageCurrentSentence} / {currentPageSize} 문장
        </span>
      </div>
      <div
        className="w-full bg-gray-200 rounded-full h-2 cursor-pointer relative"
        onClick={onProgressBarClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={onProgressBarLeave}
      >
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${currentPageProgress}%` }}
        />
        {showTooltip && (
          <div
            className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: "translateX(-50%)",
            }}
          >
            {tooltipText}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageProgress;
