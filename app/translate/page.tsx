"use client";
import AuthButton from "@/components/AuthButton";
import { useState, useEffect, useCallback } from "react";
import PdfUploader from "@/components/PdfUploader";
import LanguageSelector from "@/components/LanguageSelector";
import TranslationCard from "@/components/TranslationCard";
import DownloadButton from "@/components/DownloadButton";
import SentenceList from "@/components/SentenceList";
import ProperNounManager from "@/components/ProperNounManager";
import SavedTranslations from "@/components/SavedTranslations";
import SidebarSection from "@/components/SidebarSection";
import SidebarProgress from "@/components/SidebarProgress";
import SidebarFileInfo from "@/components/SidebarFileInfo";
import { useUser } from "@/app/auth/client";

import { useTextProcessing } from "@/hooks/useTextProcessing";
import { useTranslation } from "@/hooks/useTranslation";
import { useProperNoun } from "@/hooks/useProperNoun";
import Modal from "@/components/Modal";

import { PdfPageData } from "@/lib/pdfProcessor";
import { TranslatedTextBlock } from "@/lib/pdfLayout";
import { generateFileHash } from "@/lib/fileHash";
import { loadPdf, extractTextFromPdf } from "@/lib/pdfProcessor";
import TranslationHistoryList from "@/components/TranslationHistoryList";
import SavedTranslationsLocal from "@/components/SavedTranslationsLocal";
import { getOrCreateHistory } from "@/lib/supabase/translation";

export const dynamic = "force-dynamic";

export default function Home() {
  console.log("✅ [page.tsx] 페이지 컴포넌트 렌더 시작");

  const user = useUser();
  useEffect(() => {
    console.log("👁️ user 상태 확인:", user);
  }, [user]);
  console.log("✅ [page.tsx] 현재 user:", user);
  const [fileHash, setFileHash] = useState("");

  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("ko");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [isTranslateButtonVisible, setIsTranslateButtonVisible] =
    useState(true);
  const [translatedBlocks, setTranslatedBlocks] = useState<
    TranslatedTextBlock[][]
  >([]);
  const [skippedIndexes, setSkippedIndexes] = useState<Set<number>>(new Set());
  const [translatedIndexes, setTranslatedIndexes] = useState<Set<number>>(
    new Set()
  );
  const [starredIndexes, setStarredIndexes] = useState<Set<number>>(new Set());
  const [completedIndexes, setCompletedIndexes] = useState<Set<number>>(
    new Set()
  );
  const [shouldAutoTranslate, setShouldAutoTranslate] = useState(false);
  const [pdfPages, setPdfPages] = useState<PdfPageData[][]>([]);
  const [openSection, setOpenSection] = useState<
    "sentence" | "saved" | "dictionary" | null
  >("sentence");
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedHistory, setSelectedHistory] = useState<{
    fileHash: string;
    fileName: string;
  } | null>(null);

  const { properNouns } = useProperNoun();
  const { groupedSentences, processText } = useTextProcessing();

  // // ✅ 1. fallback props 정의
  // const fallbackTranslationProps = {
  //   translations: {},
  //   translateText: async () => {
  //     console.warn("⚠️ fallback translateText 실행됨 - 실제 번역 없음");
  //   },
  //   saveTranslation: async () => {},
  //   updateTranslation: async () => {},
  //   savedTranslations: [],
  //   copyAllTranslations: () => {},
  //   autoMove: false,
  //   setAutoMove: () => {},
  //   groupedSentences: [],
  //   setGroupedSentences: () => {},
  // };

  // // ✅ 2. 무조건 훅 호출 (조건 없이 최상위에서만)
  // const selectedFileHash = selectedHistory?.fileHash ?? "";
  // const selectedFileName = selectedHistory?.fileName ?? "";

  // const isReady = !!selectedFileHash && !!selectedFileName;

  // const translationProps = useTranslation(selectedFileHash, selectedFileName);

  // // ✅ 3. 내부에서 조건 분기 (빠짐없이 구조분해)
  // const {
  //   translations: translationContext,
  //   translateText,
  //   saveTranslation,
  //   updateTranslation: updateTranslationRef,
  //   savedTranslations,
  //   copyAllTranslations,
  //   autoMove,
  //   setAutoMove,
  //   setGroupedSentences,
  // } = isReady ? translationProps : fallbackTranslationProps;

  const {
    translations: translationContext,
    translateText,
    saveTranslation,
    updateTranslation: updateTranslationRef,
    savedTranslations,
    copyAllTranslations,
    autoMove,
    setAutoMove,
    setGroupedSentences,
  } = useTranslation(
    selectedHistory?.fileHash ?? "",
    selectedHistory?.fileName ?? ""
  );

  const updateTranslationRefTyped = updateTranslationRef as (
    translated: string,
    original: string,
    idx: number
  ) => void;

  console.log(
    "✅ [page.tsx] useTranslation 호출됨:",
    selectedHistory?.fileHash,
    selectedHistory?.fileName
  );

  const handleSentenceSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleToggleStar = useCallback((index: number) => {
    setStarredIndexes((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  }, []);

  // ✅ 래퍼 함수: PdfUploader의 인자 개수 맞추기
  const handleExtractAndSetHistory = (text: PdfPageData[][], name: string) => {
    handleTextExtracted(text, name, fileHash);
  };

  const handleTextExtracted = (
    extractedText: PdfPageData[][],
    fileNameArg: string,
    fileHashArg: string
  ) => {
    setPdfPages(extractedText);
    const extractedString = extractedText
      .map((page) => page.map((block) => block.text).join(" "))
      .join("\n\n");
    setPdfText(extractedString);
    processText(extractedString);
    setCurrentIndex(0);
    setIsPdfUploaded(true);
    setErrorMessage("");
    setFileName(fileNameArg);
    console.log("✅ setting selectedHistory:", { fileNameArg, fileHashArg }); // 추가
    setSelectedHistory({ fileHash: fileHashArg, fileName: fileNameArg });

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

  // ✅ properNouns 타입 단언
  const handleTranslate = useCallback(
    async (index: number) => {
      if (!selectedHistory?.fileHash || !selectedHistory?.fileName) {
        console.warn("⚠️ selectedHistory 없음. 번역 실행 스킵됨");
        return;
      }

      const textToTranslate = groupedSentences[index]?.join(" ") ?? "";
      console.log("🟡 [handleTranslate] 호출됨");
      console.log("🔹 index:", index);
      console.log("🔹 번역할 문장:", textToTranslate);
      console.log("🔹 selectedLanguage:", selectedLanguage);
      console.log("🔹 properNouns:", properNouns);

      setIsTranslating(true);

      try {
        await translateText(
          textToTranslate,
          selectedLanguage,
          index,
          properNouns
        );
        console.log("✅ [handleTranslate] translateText 완료");
      } catch (e) {
        console.error("❌ [handleTranslate] translateText 실패:", e);
      }

      setIsTranslating(false);
      console.log("🟢 [handleTranslate] isTranslating → false");
    },
    [
      groupedSentences,
      properNouns,
      selectedLanguage,
      translateText,
      selectedHistory,
    ]
  );

  const handleSkip = () => {
    setSkippedIndexes((prev) => new Set([...prev, currentIndex]));
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShouldAutoTranslate(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShouldAutoTranslate(true);
    }
  };

  const handleTranslationSave = (engine: "google" | "deepL") => {
    const translatedText = translationContext[engine];

    console.log("💾 [handleTranslationSave] 저장 시도", {
      engine,
      translatedText,
      currentIndex,
      original: groupedSentences[currentIndex]?.join(" "),
    });

    if (translatedText) {
      console.log("✅ [handleTranslationSave] 저장 실행");

      saveTranslation(
        translatedText,
        groupedSentences[currentIndex].join(" "),
        currentIndex
      );
      setTranslatedIndexes((prev) => new Set([...prev, currentIndex]));
      setCompletedIndexes((prev) => new Set([...prev, currentIndex]));
    } else {
      console.warn("⚠️ [handleTranslationSave] 저장 생략: 번역 결과 없음", {
        engine,
        translatedText,
      });
    }
  };

  // PDF 교체 및 업로드 핸들러
  const handleReplaceFile = async (file: File) => {
    setFileName(file.name);
    setIsPdfUploaded(false);
    setErrorMessage("");
    // 상태 초기화
    setPdfPages([]);
    setPdfText("");
    setCurrentIndex(0);
    setTranslatedBlocks([]);
    setSkippedIndexes(new Set());
    setTranslatedIndexes(new Set());
    setStarredIndexes(new Set());
    setCompletedIndexes(new Set());
    // PDF 추출
    try {
      const hash = await generateFileHash(file);
      setFileHash(hash);
      const historyId = await getOrCreateHistory(hash, file.name, user?.id); // ✅ 올바른 순서
      console.log("✅ 강제 생성된 히스토리 ID:", historyId);
      const pdfBuffer = await loadPdf(file);
      const extractedText = await extractTextFromPdf(pdfBuffer);
      handleTextExtracted(extractedText, file.name, hash); // ✅ hash 전달
      setIsPdfUploaded(true);
    } catch (error) {
      setErrorMessage(
        "PDF 처리 중 오류가 발생했습니다. 올바른 PDF 파일인지 확인해 주세요."
      );
      setIsPdfUploaded(false);
    }
  };

  useEffect(() => {
    if (
      groupedSentences.length > 0 &&
      shouldAutoTranslate &&
      currentIndex < groupedSentences.length
    ) {
      handleTranslate(currentIndex);
      setShouldAutoTranslate(false);
    }
  }, [currentIndex, shouldAutoTranslate, groupedSentences, handleTranslate]);

  useEffect(() => {
    console.log("🔄 [page.tsx] isTranslating:", isTranslating);
  }, [isTranslating]);

  const toggleSection = (section: typeof openSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const totalPages = pdfPages.length;
  let currentPage = 1;
  let totalSentencesBeforeCurrentPage = 0;
  let currentPageSentences = 0;
  let currentSentenceInPage = 0;

  for (let i = 0; i < pdfPages.length; i++) {
    const pageSentences = pdfPages[i][0]?.textBlocks?.length || 0;
    if (currentIndex < totalSentencesBeforeCurrentPage + pageSentences) {
      currentPage = i + 1;
      currentPageSentences = pageSentences;
      currentSentenceInPage =
        currentIndex - totalSentencesBeforeCurrentPage + 1;
      break;
    }
    totalSentencesBeforeCurrentPage += pageSentences;
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-50 to-white">
      {/* 로그인 버튼 (항상 상단 우측) */}
      <div className="absolute top-4 right-6 z-50">
        <AuthButton />
      </div>
      {/* 왼쪽 사이드바 (항상 렌더링됨) */}
      <div className="w-[320px] bg-white/90 border-r border-gray-100 shadow-inner flex flex-col rounded-r-3xl">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
          <AuthButton />

          {/* ✅ PDF 업로드 전일 때만 히스토리 표시 */}
          {!isPdfUploaded && (
            <div className="mt-4">
              <TranslationHistoryList
                onSelect={(hash, name) =>
                  setSelectedHistory({ fileHash: hash, fileName: name })
                }
              />
            </div>
          )}

          {/* ✅ PDF 업로드 후에만 나머지 UI 렌더 */}
          {isPdfUploaded && (
            <>
              <SidebarFileInfo
                fileName={fileName}
                onReplaceFile={handleReplaceFile}
              />
              <SidebarProgress
                totalPages={totalPages}
                currentPage={currentPage}
                totalSentences={currentPageSentences}
                currentSentenceInPage={currentSentenceInPage}
                currentIndex={currentIndex}
              />
              <SidebarSection
                title="문장 목록"
                isOpen={openSection === "sentence"}
                onToggle={() => toggleSection("sentence")}
                scrollable
              >
                <SentenceList
                  currentIndex={currentIndex}
                  onSentenceSelect={handleSentenceSelect}
                  groupedSentences={groupedSentences}
                  skippedIndexes={skippedIndexes}
                  translatedIndexes={translatedIndexes}
                  starredIndexes={starredIndexes}
                  onToggleStar={handleToggleStar}
                />
              </SidebarSection>
            </>
          )}
        </div>
      </div>

      {/* 중앙 번역 카드 */}
      <div className="flex-1 flex flex-col bg-white/80 p-4 px-8">
        {isPdfUploaded && (
          <div className="flex justify-center">
            <LanguageSelector
              onSelectSourceLanguage={setSelectedLanguage}
              onSelectTargetLanguage={setTargetLanguage}
            />

            <div className="flex justify-center mt-2">
              <button
                onClick={() => setShowDictionaryModal(true)}
                className="text-sm text-blue-600 underline hover:text-blue-800 transition"
              >
                사용자 사전 열기
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col bg-white rounded-2xl p-6">
          {!isPdfUploaded ? (
            <div className="flex-1 flex items-center justify-center">
              {/* ✅ 수정: onTextExtracted는 래퍼를 통해 호출 */}
              <PdfUploader onTextExtracted={handleExtractAndSetHistory} />
            </div>
          ) : (
            <TranslationCard
              originalText={groupedSentences[currentIndex]?.join(" ") || ""}
              translations={translationContext}
              onSave={handleTranslationSave}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isTranslating={isTranslating}
              isStarred={starredIndexes.has(currentIndex)}
              onToggleStar={() => handleToggleStar(currentIndex)}
              onSkip={handleSkip}
              onTranslate={() => handleTranslate(currentIndex)}
            />
          )}
        </div>
      </div>

      {/* 오른쪽 사이드바 */}
      {isPdfUploaded && (
        <div className="w-[600px] bg-white/90 ...">
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
            {user ? (
              <SavedTranslations
                fileHash={selectedHistory?.fileHash ?? ""}
                fileName={selectedHistory?.fileName ?? ""}
                currentIndex={currentIndex}
                onSentenceSelect={handleSentenceSelect}
              />
            ) : (
              <SavedTranslationsLocal
                savedTranslations={savedTranslations ?? []}
                groupedSentences={groupedSentences}
                currentIndex={currentIndex}
                onCopyAll={copyAllTranslations}
                // ✅ Supabase 함수는 async이므로 wrapper
                updateTranslation={(idx: number, newText: string) => {
                  const original = groupedSentences[idx].join(" ");
                  updateTranslationRefTyped(newText, original, idx); // ✅ 타입 에러 사라짐
                }}
                onSentenceSelect={handleSentenceSelect}
              />
            )}
          </div>
        </div>
      )}

      {showDictionaryModal && (
        <Modal onClose={() => setShowDictionaryModal(false)}>
          <ProperNounManager />
        </Modal>
      )}
    </div>
  );
}
