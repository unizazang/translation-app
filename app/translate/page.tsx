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
          sentences={groupedSentences}
          currentIndex={currentIndex}
          translatedIndexes={translatedIndexes}
          skippedIndexes={skippedIndexes}
          starredIndexes={starredIndexes}
          onSentenceSelect={handleSentenceSelect}
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
                  <TranslationCard
                    originalText={
                      groupedSentences[currentIndex]?.join(" ") || ""
                    }
                    translations={translations}
                    onSave={saveTranslation}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isTranslating={isTranslating}
                  />
                  <TranslationResult
                    translatedBlocks={translatedBlocks.flat()}
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
