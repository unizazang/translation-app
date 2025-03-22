"use client";

export const dynamic = "force-dynamic"; // Next.js 빌드 설정용으로 export

import dynamicComponent from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import PdfUploader from "@/components/PdfUploader";
import TranslationResult from "@/components/TranslationResult";
import LanguageSelector from "@/components/LanguageSelector";
import TranslationCard from "@/components/TranslationCard";
import { useTextProcessing } from "@/hooks/useTextProcessing";
import { useTranslation } from "@/hooks/useTranslation";
import { useProperNoun } from "@/hooks/useProperNoun"; // ✅ 고유명사 훅 추가
import HelpButton from "@/components/HelpButton"; // ✅ FAB 버튼 추가
import HelpWidget from "@/components/HelpWidget"; // ✅ HelpWidget 추가
import { PdfPageData } from "@/lib/pdfProcessor"; // ✅ PdfPageData import 추가
import { TranslatedTextBlock } from "@/lib/pdfLayout";
import DownloadButton from "@/components/DownloadButton";
import SentenceList from "@/components/SentenceList";
import { useResizable } from "@/hooks/useResizable";
import "@/src/fontawesome"; // ✅ FontAwesome 설정 파일 import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import SidebarTabs from "@/components/SidebarTabs";

const ProperNounManager = dynamicComponent(
  () => import("@/components/ProperNounManager"),
  { ssr: false }
);
const SavedTranslations = dynamicComponent(
  () => import("@/components/SavedTranslations"),
  { ssr: false }
);

export default function Home() {
  const [pdfText, setPdfText] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isPdfUploaded, setIsPdfUploaded] = useState<boolean>(false);
  const [isTranslateButtonVisible, setIsTranslateButtonVisible] =
    useState<boolean>(true);
  const [translatedBlocks, setTranslatedBlocks] = useState<
    TranslatedTextBlock[][]
  >([]);
  const [tooltipText, setTooltipText] = useState<string>("");
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [skippedIndexes, setSkippedIndexes] = useState<Set<number>>(new Set());
  const [translatedIndexes, setTranslatedIndexes] = useState<Set<number>>(
    new Set()
  );
  const [starredIndexes, setStarredIndexes] = useState<Set<number>>(new Set());
  const [pendingTranslation, setPendingTranslation] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const { properNouns } = useProperNoun();
  const { groupedSentences, processText } = useTextProcessing();
  const {
    translations,
    translateText,
    saveTranslation,
    updateTranslation,
    savedTranslations,
    copyAllTranslations,
    autoMove,
  } = useTranslation();

  // 리사이즈 훅 사용
  const {
    width: sidebarWidth,
    isResizing,
    handleResizeStart,
    isCollapsed,
  } = useResizable({
    initialWidth: 320,
    minWidth: 200,
    maxWidth: 600,
  });

  // 사이드바 접기/펼치기 핸들러
  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  // 문장 선택 핸들러
  const handleSentenceSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 중요 표시 토글 핸들러
  const handleToggleStar = useCallback((index: number) => {
    setStarredIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleTextExtracted = (extractedText: PdfPageData[][]) => {
    const extractedString = extractedText
      .map((page) => page.map((block) => block.text).join(" "))
      .join("\n\n");

    setPdfText(extractedString);
    processText(extractedString);
    setCurrentIndex(0);
    setIsPdfUploaded(true);

    const initialTranslatedBlocks = extractedText.map((page) =>
      page.map((block) => ({
        text: block.text,
        x: block.x,
        y: block.y,
        width: block.width || 0,
        height: block.height || 0,
        translatedText: block.text,
      }))
    );
    setTranslatedBlocks(initialTranslatedBlocks);
  };

  const handleTranslate = async (index: number) => {
    if (groupedSentences[index]) {
      setIsTranslating(true);
      await translateText(
        groupedSentences[index].join(" "),
        selectedLanguage,
        index,
        properNouns
      );
      setIsTranslating(false);
      setIsTranslateButtonVisible(false);
    }
  };

  // 건너뛰기 처리 함수
  const handleSkip = () => {
    setSkippedIndexes((prev) => new Set([...prev, currentIndex]));
    // 다음 문장으로 자동 이동
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      handleTranslate(currentIndex + 1);
    }
  };

  // 번역 완료 처리 함수
  const handleTranslationSave = () => {
    if (translations.google) {
      saveTranslation(
        translations.google,
        groupedSentences[currentIndex].join(" ")
      );
      setTranslatedIndexes((prev) => new Set([...prev, currentIndex]));
      // 자동 이동이 활성화된 경우에만 다음 문장으로 이동
      if (autoMove) {
        handleNext();
      }
      // 토스트 메시지 표시
      setTooltipText("번역이 저장되었습니다.");
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const handleNext = () => {
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      handleTranslate(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      handleTranslate(currentIndex - 1);
    }
  };

  // 번역 변경 처리 함수
  const handleTranslationChange = (value: string) => {
    setTranslatedBlocks((prev) => {
      const newBlocks = [...prev];
      const currentPage = Math.floor(currentIndex / 10);
      const currentBlock = currentIndex % 10;

      if (newBlocks[currentPage] && newBlocks[currentPage][currentBlock]) {
        newBlocks[currentPage][currentBlock].translatedText = value;
      }

      return newBlocks;
    });
  };

  // 진행 바 클릭 핸들러
  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // 백분율을 기반으로 문장 인덱스 계산
    const targetIndex = Math.floor(
      (percentage / 100) * groupedSentences.length
    );
    setCurrentIndex(targetIndex);
  };

  // 현재 페이지 진행 바 클릭 핸들러
  const handlePageProgressBarClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // 현재 페이지 내에서의 상대적 위치 계산
    const pageSize = currentPageEndIndex - currentPageStartIndex;
    const targetIndex =
      currentPageStartIndex + Math.floor((percentage / 100) * pageSize);
    setCurrentIndex(targetIndex);
  };

  // 진행 바 호버 핸들러
  const handleProgressBarHover = (
    event: React.MouseEvent<HTMLDivElement>,
    isPageProgress: boolean = false
  ) => {
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    let targetIndex;
    if (isPageProgress) {
      const pageSize = currentPageEndIndex - currentPageStartIndex;
      targetIndex =
        currentPageStartIndex + Math.floor((percentage / 100) * pageSize);
    } else {
      targetIndex = Math.floor((percentage / 100) * groupedSentences.length);
    }

    setTooltipText(`${targetIndex + 1}번째 문장`);
    setShowTooltip(true);
  };

  // 번역 진행 상태 계산
  const currentPage = Math.floor(currentIndex / 10); // 페이지당 10개 문장 가정
  const totalPages = Math.ceil(groupedSentences.length / 10);
  const progressPercentage = Math.round(
    (currentIndex / groupedSentences.length) * 100
  );

  // 현재 페이지 내 진행 상태 계산
  const currentPageStartIndex = (currentPage - 1) * 10;
  const currentPageEndIndex = Math.min(
    currentPageStartIndex + 10,
    groupedSentences.length
  );
  const currentPageProgress = Math.round(
    ((currentIndex - currentPageStartIndex) /
      (currentPageEndIndex - currentPageStartIndex)) *
      100
  );

  useEffect(() => {
    if (groupedSentences.length > 0) {
      handleTranslate(currentIndex);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (groupedSentences.length > 0 && currentIndex < groupedSentences.length) {
      translateText(
        groupedSentences[currentIndex].join(" "),
        selectedLanguage,
        currentIndex,
        properNouns
      );
    }
  }, [properNouns]);

  useEffect(() => {
    if (translations.google && groupedSentences[currentIndex]) {
      setTranslatedIndexes((prev) => new Set([...prev, currentIndex]));
      setTranslatedBlocks((prev) => {
        const newBlocks = [...prev];
        const currentPage = Math.floor(currentIndex / 10);
        const currentBlock = currentIndex % 10;

        if (newBlocks[currentPage] && newBlocks[currentPage][currentBlock]) {
          newBlocks[currentPage][currentBlock].translatedText =
            translations.google;
        }

        return newBlocks;
      });
    }
  }, [translations.google, currentIndex, groupedSentences]);

  return (
    <div className="min-h-screen flex">
      {/* 사이드바 */}
      <div
        className={`relative border-r bg-white transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "w-0" : ""}`}
        style={{ width: isSidebarCollapsed ? 0 : sidebarWidth }}
      >
        <SidebarTabs
          currentIndex={currentIndex}
          onSentenceSelect={handleSentenceSelect}
          groupedSentences={groupedSentences}
          skippedIndexes={skippedIndexes}
          translatedIndexes={translatedIndexes}
          starredIndexes={starredIndexes}
          onToggleStar={handleToggleStar}
        />
        {/* 리사이즈 핸들러 */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize"
          onMouseDown={handleResizeStart}
        />
        {/* 사이드바 토글 버튼 */}
        <button
          onClick={handleToggleSidebar}
          className="absolute -right-4 top-4 w-8 h-8 bg-white border rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <FontAwesomeIcon
            icon={isSidebarCollapsed ? faChevronRight : faChevronLeft}
            className="text-gray-600"
          />
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              PDF 번역기
            </h1>

            {!isPdfUploaded ? (
              <PdfUploader onTextExtracted={handleTextExtracted} />
            ) : (
              <>
                <div className="space-y-6">
                  <LanguageSelector onSelectLanguage={setSelectedLanguage} />

                  {/* 번역 진행 상태 표시 */}
                  {groupedSentences.length > 0 && (
                    <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          페이지 {currentPage} / {totalPages}
                        </span>
                        <span className="text-sm text-gray-600">
                          진행률: {progressPercentage}%
                        </span>
                      </div>
                      <div
                        className="w-full bg-gray-200 rounded-full h-2.5 cursor-pointer relative"
                        onClick={handleProgressBarClick}
                        onMouseMove={(e) => handleProgressBarHover(e)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                        {showTooltip && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                            {tooltipText}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {currentIndex + 1} / {groupedSentences.length} 문장
                      </div>

                      {/* 현재 페이지 내 진행 상태 */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            현재 페이지 진행률: {currentPageProgress}%
                          </span>
                          <span className="text-sm text-gray-600">
                            {currentIndex - currentPageStartIndex + 1} /{" "}
                            {currentPageEndIndex - currentPageStartIndex} 문장
                          </span>
                        </div>
                        <div
                          className="w-full bg-gray-200 rounded-full h-2 cursor-pointer relative"
                          onClick={handlePageProgressBarClick}
                          onMouseMove={(e) => handleProgressBarHover(e, true)}
                          onMouseLeave={() => setShowTooltip(false)}
                        >
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${currentPageProgress}%` }}
                          />
                          {showTooltip && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                              {tooltipText}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {isTranslateButtonVisible && (
                    <button
                      onClick={() => handleTranslate(currentIndex)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      disabled={isTranslating}
                    >
                      {isTranslating ? "번역 중..." : "번역 시작"}
                    </button>
                  )}

                  <TranslationCard
                    originalText={
                      groupedSentences[currentIndex]?.join(" ") || ""
                    }
                    translations={translations}
                    onSave={handleTranslationSave}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isTranslating={isTranslating}
                    isStarred={starredIndexes.has(currentIndex)}
                    onToggleStar={() => handleToggleStar(currentIndex)}
                    onSkip={handleSkip}
                  />
                  <SavedTranslations
                    savedTranslations={savedTranslations}
                    onCopyAll={copyAllTranslations}
                    updateTranslation={updateTranslation}
                  />
                  <DownloadButton translatedBlocks={translatedBlocks} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
