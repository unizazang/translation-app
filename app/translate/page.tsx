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

import { PdfPageData } from "@/lib/pdfProcessor"; // ✅ PdfPageData import 추가
import { TranslatedTextBlock } from "@/lib/pdfLayout";
import DownloadButton from "@/components/DownloadButton";

import { useResizable } from "@/hooks/useResizable";
import "@/src/fontawesome"; // ✅ FontAwesome 설정 파일 import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import SidebarTabs from "@/components/SidebarTabs";
import PageProgress from "@/components/PageProgress";

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
  const [completedIndexes, setCompletedIndexes] = useState<Set<number>>(
    new Set()
  );
  const [shouldAutoTranslate, setShouldAutoTranslate] =
    useState<boolean>(false);

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

  // 진행률 계산 함수들
  const calculatePageProgress = useCallback(() => {
    if (!groupedSentences.length) return 0;
    const currentPageStartIndex = Math.floor(currentIndex / 10) * 10;
    const currentPageEndIndex = Math.min(
      currentPageStartIndex + 10,
      groupedSentences.length
    );
    const pageSize = currentPageEndIndex - currentPageStartIndex;

    if (pageSize === 0) return 0;

    const completedInPage = Array.from(completedIndexes).filter(
      (index) => index >= currentPageStartIndex && index < currentPageEndIndex
    ).length;

    return Math.min(Math.round((completedInPage / pageSize) * 100), 100);
  }, [currentIndex, groupedSentences.length, completedIndexes]);

  const calculateTotalProgress = useCallback(() => {
    if (!groupedSentences.length) return 0;
    return Math.min(
      Math.round((completedIndexes.size / groupedSentences.length) * 100),
      100
    );
  }, [groupedSentences.length, completedIndexes]);

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
    setCompletedIndexes(new Set());

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
    }
  };

  // 건너뛰기 처리 함수
  const handleSkip = () => {
    setSkippedIndexes((prev) => new Set([...prev, currentIndex]));

    // 다음 문장으로 자동 이동
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleMarkAsReviewed = (indexes: number[]) => {
    setCompletedIndexes((prev) => {
      const newSet = new Set(prev);
      indexes.forEach((index) => newSet.add(index));
      return newSet;
    });
    setTooltipText("선택한 문장이 검토 완료로 표시되었습니다.");
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const handleNext = () => {
    if (currentIndex < groupedSentences.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      handleSentenceSelect(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // 번역 완료 처리 함수
  const handleTranslationSave = () => {
    if (translations.google) {
      // 상태 업데이트를 한 번에 처리
      const updates = () => {
        setShouldAutoTranslate(true);
        saveTranslation(
          translations.google,
          groupedSentences[currentIndex].join(" ")
        );
        setTranslatedIndexes((prev) => new Set([...prev, currentIndex]));
        setCompletedIndexes((prev) => new Set([...prev, currentIndex]));

        // 번역된 블록 업데이트
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

        // 자동 이동이 활성화된 경우에만 다음 문장으로 이동
        if (autoMove) {
          const nextIndex = currentIndex + 1;
          if (nextIndex < groupedSentences.length) {
            setCurrentIndex(nextIndex);
          }
        }
      };

      updates();

      // 토스트 메시지 표시
      setTooltipText("번역이 저장되었습니다.");
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
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
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // 현재 페이지의 시작과 끝 인덱스 계산
    const currentPageStartIndex = (currentPage - 1) * 10;
    const currentPageEndIndex = Math.min(
      currentPageStartIndex + 10,
      groupedSentences.length
    );
    const currentPageSize = currentPageEndIndex - currentPageStartIndex;

    // 클릭한 위치에 해당하는 문장 인덱스 계산
    const targetIndex =
      currentPageStartIndex + Math.floor((percentage / 100) * currentPageSize);

    if (
      targetIndex >= currentPageStartIndex &&
      targetIndex < currentPageEndIndex
    ) {
      handleSentenceSelect(targetIndex);
    }
  };

  // 진행 바 호버 핸들러
  const handleProgressBarHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // 현재 페이지의 시작과 끝 인덱스 계산
    const currentPageStartIndex = (currentPage - 1) * 10;
    const currentPageEndIndex = Math.min(
      currentPageStartIndex + 10,
      groupedSentences.length
    );
    const currentPageSize = currentPageEndIndex - currentPageStartIndex;

    // 호버한 위치에 해당하는 문장 인덱스 계산
    const targetIndex =
      currentPageStartIndex + Math.floor((percentage / 100) * currentPageSize);

    if (
      targetIndex >= currentPageStartIndex &&
      targetIndex < currentPageEndIndex
    ) {
      setTooltipText(`${targetIndex + 1}번 문장으로 이동`);
      setShowTooltip(true);
    }
  };

  // 번역 진행 상태 계산
  const currentPage = Math.floor(currentIndex / 10) + 1; // 페이지는 1부터 시작
  const totalPages = Math.ceil(groupedSentences.length / 10);
  const progressPercentage = calculateTotalProgress();
  const currentPageProgress = calculatePageProgress();

  // 현재 페이지 내 진행 상태 계산
  const currentPageStartIndex = (currentPage - 1) * 10;
  const currentPageEndIndex = Math.min(
    currentPageStartIndex + 10,
    groupedSentences.length
  );

  // 현재 페이지의 문장 수 계산
  const currentPageSentenceCount = currentPageEndIndex - currentPageStartIndex;
  const currentPageCurrentSentence = currentIndex - currentPageStartIndex + 1;

  // properNouns가 변경될 때만 번역 실행
  useEffect(() => {
    if (
      groupedSentences.length > 0 &&
      shouldAutoTranslate &&
      currentIndex < groupedSentences.length
    ) {
      handleTranslate(currentIndex);
    }
  }, [properNouns]);

  return (
    <div className="min-h-screen flex">
      {/* 사이드바 */}
      {isPdfUploaded && (
        <div
          className={`relative border-r bg-white transition-all duration-300 ease-in-out overflow-hidden
          ${isSidebarCollapsed ? "w-0" : ""}`}
          style={{ width: isSidebarCollapsed ? 0 : sidebarWidth }}
        >
          <div className="h-full">
            <SidebarTabs
              currentIndex={currentIndex}
              onSentenceSelect={handleSentenceSelect}
              groupedSentences={groupedSentences}
              skippedIndexes={skippedIndexes}
              translatedIndexes={translatedIndexes}
              starredIndexes={starredIndexes}
              onToggleStar={handleToggleStar}
              completedIndexes={completedIndexes}
              isPdfUploaded={isPdfUploaded}
              onMarkAsReviewed={handleMarkAsReviewed}
              isSidebarCollapsed={isSidebarCollapsed}
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
        </div>
      )}

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
                    <PageProgress
                      currentPage={currentPage}
                      totalPages={totalPages}
                      currentIndex={currentIndex}
                      totalSentences={groupedSentences.length}
                      completedIndexes={completedIndexes}
                      onProgressBarClick={handleProgressBarClick}
                      onProgressBarHover={(e) => handleProgressBarHover(e)}
                      onProgressBarLeave={() => setShowTooltip(false)}
                      showTooltip={showTooltip}
                      tooltipText={tooltipText}
                    />
                  )}

                  {/* 번역 시작 버튼 */}
                  {isTranslateButtonVisible && (
                    <button
                      onClick={() => handleTranslate(currentIndex)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      disabled={isTranslating}
                    >
                      {isTranslating ? "번역 중..." : "번역 실행"}
                    </button>
                  )}

                  <p className="text-gray-700">
                    파일이 업로드되었습니다! '번역 시작'을 눌러 번역을
                    진행하세요.
                  </p>

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
