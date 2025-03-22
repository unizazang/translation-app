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

const ProperNounManager = dynamicComponent(
  () => import("@/components/ProperNounManager"),
  { ssr: false }
);
const SavedTranslations = dynamicComponent(
  () => import("@/components/SavedTranslations"),
  { ssr: false }
);
import "@/src/fontawesome"; // ✅ FontAwesome 설정 파일 import

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

  const { properNouns } = useProperNoun(); // ✅ 최신 고유명사 목록 가져오기
  const { groupedSentences, processText } = useTextProcessing();
  const {
    translations,
    translateText,
    saveTranslation,
    updateTranslation, // ✅ 추가
    savedTranslations,
    copyAllTranslations, // ✅ 추가
  } = useTranslation();

  // 리사이즈 훅 사용
  const {
    width: sidebarWidth,
    isResizing,
    setIsResizing,
  } = useResizable({
    initialWidth: 320,
    minWidth: 200,
    maxWidth: 600,
  });

  // 번역 진행 상태 계산
  const currentPage = Math.floor(currentIndex / 10) + 1; // 페이지당 10개 문장 가정
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

  const handleTextExtracted = (extractedText: PdfPageData[][]) => {
    const extractedString = extractedText
      .map((page) => page.map((block) => block.text).join(" "))
      .join("\n\n");

    setPdfText(extractedString);
    processText(extractedString);
    setCurrentIndex(0);
    setIsPdfUploaded(true);

    // 레이아웃 정보 저장 (타입 변환 로직 수정)
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
    console.log("📝 초기 번역 블록 설정:", initialTranslatedBlocks);
    setTranslatedBlocks(initialTranslatedBlocks);
  };

  const handleTranslate = async (index: number) => {
    if (groupedSentences[index]) {
      setIsTranslating(true);
      await translateText(
        groupedSentences[index].join(" "),
        selectedLanguage,
        index,
        properNouns // ✅ properNouns 전달
      );
      setIsTranslating(false);
      setIsTranslateButtonVisible(false); // ✅ 번역 시작 버튼 숨기기
    }
  };

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
  }, [properNouns]); // ✅ properNouns 변경 감지

  useEffect(() => {
    if (translations.google && groupedSentences[currentIndex]) {
      setTranslatedIndexes((prev) => new Set([...prev, currentIndex]));
      setTranslatedBlocks((prev) => {
        const newBlocks = [...prev];
        const currentPage = Math.floor(currentIndex / 10); // 페이지당 10개 문장 가정
        const currentBlock = currentIndex % 10;

        if (newBlocks[currentPage] && newBlocks[currentPage][currentBlock]) {
          newBlocks[currentPage][currentBlock].translatedText =
            translations.google;
          console.log("📝 번역된 블록 업데이트:", {
            page: currentPage,
            block: currentBlock,
            text: translations.google,
          });
        }

        return newBlocks;
      });
    }
  }, [translations.google, currentIndex, groupedSentences]);

  const handleNext = () => {
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // 진행률 계산 함수
  const calculateProgress = useCallback(() => {
    const processed = new Set([
      ...Array.from(translatedIndexes),
      ...Array.from(skippedIndexes),
    ]);
    return (processed.size / (groupedSentences?.length || 1)) * 100;
  }, [translatedIndexes, skippedIndexes, groupedSentences]);

  // 번역 완료 처리 함수
  const handleTranslationSave = useCallback(() => {
    if (currentIndex === undefined) return;
    setTranslatedIndexes((prev) => new Set([...prev, currentIndex]));
    setCurrentIndex((prev) => (prev ?? 0) + 1);
  }, [currentIndex]);

  // 건너뛰기 처리 함수
  const handleSkip = useCallback(() => {
    if (currentIndex === undefined) return;
    setSkippedIndexes((prev) => new Set([...prev, currentIndex]));
    setCurrentIndex((prev) => (prev ?? 0) + 1);
  }, [currentIndex]);

  // 문장 선택 핸들러
  const handleSentenceSelect = useCallback((index: number) => {
    setCurrentIndex(index);
    // 번역 상태는 변경하지 않음
  }, []);

  // 중요 표시 토글 핸들러
  const handleToggleStar = (index: number) => {
    setStarredIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen">
      {/* 리사이즈 가능한 사이드바 */}
      <div
        className="relative h-full bg-white border-r"
        style={{ width: `${sidebarWidth}px` }}
      >
        <SentenceList
          sentences={groupedSentences}
          currentIndex={currentIndex}
          translatedIndexes={translatedIndexes}
          skippedIndexes={skippedIndexes}
          starredIndexes={starredIndexes}
          onSentenceSelect={handleSentenceSelect}
          onToggleStar={handleToggleStar}
        />
        <div
          className="absolute right-0 top-0 w-1 h-full cursor-ew-resize hover:bg-blue-500"
          onMouseDown={() => setIsResizing(true)}
        />
      </div>

      {/* 메인 번역 영역 */}
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">PDF 번역기</h1>

        {!isPdfUploaded ? (
          <PdfUploader onTextExtracted={handleTextExtracted} />
        ) : (
          <>
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

            <div>
              {groupedSentences.length > 0 && (
                <TranslationCard
                  originalText={groupedSentences[currentIndex].join(" ")}
                  translations={translations}
                  onSave={saveTranslation} // ✅ 추가
                />
              )}
            </div>

            <div className="flex gap-4 mt-4">
              {currentIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  disabled={isTranslating}
                >
                  {isTranslating ? "번역 중..." : "이전 문장"}
                </button>
              )}
              <button
                onClick={handleTranslationSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                저장하기
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                건너뛰기
              </button>
              {currentIndex < groupedSentences.length - 1 && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 cursor-pointer bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  disabled={isTranslating}
                >
                  {isTranslating ? "번역 중..." : "다음 문장"}
                </button>
              )}
            </div>

            <SavedTranslations
              savedTranslations={savedTranslations}
              onCopyAll={copyAllTranslations}
              updateTranslation={updateTranslation} // ✅ 추가
            />

            {isPdfUploaded && translatedBlocks.length > 0 && (
              <DownloadButton translatedBlocks={translatedBlocks} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
