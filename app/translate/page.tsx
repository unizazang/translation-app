"use client";

export const dynamic = "force-dynamic"; // Next.js 빌드 설정용으로 export

import dynamicComponent from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import PdfUploader from "@/components/PdfUploader";
// import TranslationResult from "@/components/TranslationResult";
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
import SidebarProgress from "@/components/SidebarProgress";
import FeatureDescription from "@/components/FeatureDescription";
// import Sidebar from "@/components/Sidebar";

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

  // 현재 페이지 계산
  const currentPage = Math.floor(currentIndex / 10) + 1;
  const totalPages = Math.ceil(groupedSentences.length / 10);

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
    <div className="flex min-h-screen bg-gray-100">
      {isPdfUploaded && (
        <>
          <button
            onClick={handleToggleSidebar}
            className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
          >
            <FontAwesomeIcon
              icon={isSidebarCollapsed ? faChevronRight : faChevronLeft}
              className="text-gray-600"
            />
          </button>
          <div className={`fixed left-0 top-0 min-h-screen flex flex-col bg-white shadow-lg transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : ""
          }`} style={{
            width: isSidebarCollapsed ? "4rem" : `${sidebarWidth}px`,
          }}>
            <SidebarTabs
              currentIndex={currentIndex}
              onSentenceSelect={handleSentenceSelect}
              groupedSentences={groupedSentences}
              skippedIndexes={skippedIndexes}
              translatedIndexes={translatedIndexes}
              starredIndexes={starredIndexes}
              onToggleStar={handleToggleStar}
              isPdfUploaded={isPdfUploaded}
              onMarkAsReviewed={handleMarkAsReviewed}
              isSidebarCollapsed={isSidebarCollapsed}
            />
          </div>
        </>
      )}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? "ml-16" : `ml-[${sidebarWidth}px]`
      }`}>
        <div className="p-6">
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl text-center font-bold text-gray-800 mb-8">
                PDF 번역기
              </h1>

              {!isPdfUploaded ? (
                <>
                  <PdfUploader onTextExtracted={handleTextExtracted} />
                  <FeatureDescription />
                </>
              ) : (
                <>
                  <div className="space-y-6">
                    <LanguageSelector onSelectLanguage={setSelectedLanguage} />

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
    </div>
  );
}
