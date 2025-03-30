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
  const [targetLanguage, setTargetLanguage] = useState<string>("ko");
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
  const [pdfPages, setPdfPages] = useState<PdfPageData[][]>([]);
  const [translations, setTranslations] = useState<{
    google: string;
    papago: string;
    deepL: string;
  }>({
    google: "",
    papago: "",
    deepL: "",
  });

  const [cachedTranslations, setCachedTranslations] = useState<Record<number, any>>({});

  const { properNouns } = useProperNoun();
  const { groupedSentences, processText } = useTextProcessing();
  const {
    translations: translationContext,
    translateText,
    saveTranslation,
    updateTranslation,
    savedTranslations,
    copyAllTranslations,
    autoMove,
    setAutoMove,
    setTargetLanguage: setTranslationTargetLanguage,
    setTranslations: setTranslationContextTranslations,
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
    console.log("✅ handleTextExtracted 실행됨! 추출된 텍스트:", extractedText);
    setPdfPages(extractedText);
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

  // 캐시 데이터 검증 함수
  const validateCacheData = useCallback((data: any): boolean => {
    if (!data) return false;
    if (!data.google || typeof data.google !== 'string' || data.google.length === 0) return false;
    return true;
  }, []);

  // 캐시 체크 함수
  const checkCache = useCallback((index: number): boolean => {
    const cached = cachedTranslations[index];
    if (!cached) return false;
    
    // 캐시 데이터 구조 검증
    if (!validateCacheData(cached)) {
      console.warn('⚠️ 유효하지 않은 캐시 데이터:', { index, cached });
      return false;
    }
    
    return true;
  }, [cachedTranslations, validateCacheData]);

  // localStorage 관련 유틸리티 함수
  const loadCachedTranslations = useCallback(() => {
    try {
      const savedCache = localStorage.getItem('cachedTranslations');
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        // 저장된 캐시 데이터 검증
        const validCache = Object.entries(parsedCache).reduce((acc, [key, value]) => {
          if (validateCacheData(value)) {
            acc[Number(key)] = value;
          }
          return acc;
        }, {} as Record<number, any>);

        console.log('📥 localStorage에서 캐시 로드:', {
          totalCached: Object.keys(validCache).length,
          cachedIndexes: Object.keys(validCache),
          invalidEntries: Object.keys(parsedCache).length - Object.keys(validCache).length
        });
        return validCache;
      }
    } catch (error) {
      console.error('❌ 캐시 로드 실패:', error);
    }
    return {};
  }, [validateCacheData]);

  const saveCachedTranslations = useCallback((cache: Record<number, any>) => {
    try {
      // 저장 전 캐시 데이터 검증
      const validCache = Object.entries(cache).reduce((acc, [key, value]) => {
        if (validateCacheData(value)) {
          acc[Number(key)] = value;
        }
        return acc;
      }, {} as Record<number, any>);

      localStorage.setItem('cachedTranslations', JSON.stringify(validCache));
      console.log('💾 localStorage에 캐시 저장:', {
        totalCached: Object.keys(validCache).length,
        cachedIndexes: Object.keys(validCache),
        invalidEntries: Object.keys(cache).length - Object.keys(validCache).length
      });
    } catch (error) {
      console.error('❌ 캐시 저장 실패:', error);
    }
  }, [validateCacheData]);

  // PDF 파일 업로드 시 캐시 로드
  useEffect(() => {
    if (pdfText) {
      const loadedCache = loadCachedTranslations();
      setCachedTranslations(loadedCache);
    }
  }, [pdfText, loadCachedTranslations]);

  // 번역 시작 시 캐시 체크
  const handleTranslate = useCallback(async (index: number) => {
    console.log("🔄 번역 시작:", {
      index,
      hasCache: checkCache(index),
      cachedTranslations: Object.keys(cachedTranslations)
    });

    // 캐시된 번역 결과가 있으면 바로 사용
    if (checkCache(index)) {
      console.log("📌 캐시된 번역 결과 사용:", {
        index,
        translations: cachedTranslations[index]
      });
      setTranslationContextTranslations(cachedTranslations[index]);
      setIsTranslating(false);
      return;
    }

    try {
      console.log("🌐 API 호출로 번역 시작:", {
        index,
        text: groupedSentences[index].join(" ")
      });
      setIsTranslating(true);
      await translateText(
        groupedSentences[index].join(" "),
        selectedLanguage,
        index,
        properNouns
      );
      
      // 번역 결과를 캐시에 저장
      if (translationContext.google) {
        console.log("💾 번역 결과 캐시 저장 (handleTranslate):", {
          index,
          translations: translationContext
        });
        setCachedTranslations(prev => {
          const newCache = {
            ...prev,
            [index]: translationContext
          };
          saveCachedTranslations(newCache);
          return newCache;
        });
      }
      
      setIsTranslating(false);
    } catch (error) {
      console.error("🚨 번역 에러:", error);
      setIsTranslating(false);
    }
  }, [groupedSentences, properNouns, checkCache, cachedTranslations, setTranslationContextTranslations, saveCachedTranslations, translationContext]);

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

  // 다음 문장 이동
  const handleNext = () => {
    if (currentIndex < groupedSentences.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log("⏭️ 다음 문장으로 이동:", {
        currentIndex,
        nextIndex,
        hasCache: checkCache(nextIndex),
        cachedTranslations: Object.keys(cachedTranslations)
      });

      // 캐시된 번역 결과가 있으면 바로 사용
      if (checkCache(nextIndex)) {
        console.log("📌 캐시된 번역 결과 사용 (다음):", {
          index: nextIndex,
          translations: cachedTranslations[nextIndex]
        });
        setTranslationContextTranslations(cachedTranslations[nextIndex]);
        setCurrentIndex(nextIndex);
      } else {
        // 캐시된 결과가 없을 때만 API 호출
        setCurrentIndex(nextIndex);
        setTimeout(() => {
          setShouldAutoTranslate(true);
        }, 0);
      }
    }
  };

  // 이전 문장 이동
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      console.log("⏮️ 이전 문장으로 이동:", {
        currentIndex,
        prevIndex,
        hasCache: checkCache(prevIndex),
        cachedTranslations: Object.keys(cachedTranslations)
      });

      // 캐시된 번역 결과가 있으면 바로 사용
      if (checkCache(prevIndex)) {
        console.log("📌 캐시된 번역 결과 사용 (이전):", {
          index: prevIndex,
          translations: cachedTranslations[prevIndex]
        });
        setTranslationContextTranslations(cachedTranslations[prevIndex]);
        setCurrentIndex(prevIndex);
      } else {
        // 캐시된 결과가 없을 때만 API 호출
        setCurrentIndex(prevIndex);
        setTimeout(() => {
          setShouldAutoTranslate(true);
        }, 0);
      }
    }
  };

  // 번역 완료 처리 함수
  const handleTranslationSave = () => {
    if (translationContext.google) {
      console.log("💾 번역 결과 저장 시작:", {
        index: currentIndex,
        translations: translationContext
      });

      // 상태 업데이트를 한 번에 처리
      const updates = () => {
        setShouldAutoTranslate(true);
        saveTranslation(
          translationContext.google,
          groupedSentences[currentIndex].join(" ")
        );
        setTranslatedIndexes((prev) => new Set([...prev, currentIndex]));
        setCompletedIndexes((prev) => new Set([...prev, currentIndex]));

        // 번역 결과를 캐시에 저장
        setCachedTranslations((prev) => {
          const newCache = {
            ...prev,
            [currentIndex]: translationContext
          };
          console.log("📦 번역 결과 캐시 저장 (handleTranslationSave):", {
            index: currentIndex,
            translations: translationContext,
            totalCached: Object.keys(newCache).length,
            isValid: validateCacheData(translationContext)
          });
          // localStorage에도 저장
          saveCachedTranslations(newCache);
          return newCache;
        });

        // 번역된 블록 업데이트
        setTranslatedBlocks((prev) => {
          const newBlocks = [...prev];
          const currentPage = Math.floor(currentIndex / 10);
          const currentBlock = currentIndex % 10;

          if (newBlocks[currentPage] && newBlocks[currentPage][currentBlock]) {
            newBlocks[currentPage][currentBlock].translatedText =
              translationContext.google;
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
      currentIndex < groupedSentences.length &&
      !checkCache(currentIndex) // 캐시 체크 함수 사용
    ) {
      console.log("🔄 useEffect에서 번역 시작:", {
        currentIndex,
        hasCache: checkCache(currentIndex)
      });
      handleTranslate(currentIndex);
      setShouldAutoTranslate(false);
    }
  }, [currentIndex, shouldAutoTranslate, groupedSentences, checkCache, handleTranslate]);

  return (
    <div className="min-h-screen flex">
      {/* 사이드바 */}
      {isPdfUploaded && (
        <div className="relative" style={{ width: sidebarWidth }}>
          {/* 외부 컨테이너: 토글 버튼 포함 */}
          <div
            className="fixed top-0 h-screen border-r bg-white transition-all duration-300 overflow-hidden"
            style={{
              width: sidebarWidth,
              left: isSidebarCollapsed ? -sidebarWidth : 0,
            }}
          >
            {/* 내부 컨테이너 */}
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
                isSidebarCollapsed={isSidebarCollapsed}
                pdfPages={pdfPages}
              />
            </div>
            {/* 리사이즈 핸들러 */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize"
              onMouseDown={handleResizeStart}
            />
          </div>
          {/* 토글 버튼 */}
          <button
            onClick={handleToggleSidebar}
            className={`fixed top-4 z-50 w-8 h-8 bg-white border rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-all duration-300
              ${isSidebarCollapsed ? "translate-x-0" : "-translate-x-1/2"}`}
            style={{ left: isSidebarCollapsed ? `20px` : `${sidebarWidth}px` }}
          >
            <FontAwesomeIcon
              icon={isSidebarCollapsed ? faChevronRight : faChevronLeft}
              className="text-gray-600"
            />
          </button>
        </div>
      )}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? "ml-0" : `ml-[${sidebarWidth}px]`
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
                    <LanguageSelector
                      onSelectSourceLanguage={setSelectedLanguage}
                      onSelectTargetLanguage={(lang) => {
                        setTargetLanguage(lang);
                        setTranslationTargetLanguage(lang);
                      }}
                    />

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
                      translations={translationContext}
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
