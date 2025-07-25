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

import { useTextProcessing } from "@/hooks/useTextProcessing";
import { useTranslation } from "@/hooks/useTranslation";
import { useProperNoun } from "@/hooks/useProperNoun";
import Modal from "@/components/Modal";

import { PdfPageData } from "@/lib/pdfProcessor";
import { TranslatedTextBlock } from "@/lib/pdfLayout";
import { generateFileHash } from "@/lib/fileHash";
import { loadPdf, extractTextFromPdf } from "@/lib/pdfProcessor";
import TranslationHistoryList from "@/components/TranslationHistoryList";

export const dynamic = "force-dynamic";

export default function Home() {
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
  const {
    translations: translationContext,
    translateText,
    saveTranslation,
    updateTranslation,
    savedTranslations,
    copyAllTranslations,
    autoMove,
    setAutoMove,
  } = useTranslation(selectedHistory?.fileHash, selectedHistory?.fileName); // ✅ 반드시 전달

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

  const handleTextExtracted = (
    extractedText: PdfPageData[][],
    fileNameArg: string
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

  const handleTranslate = useCallback(
    async (index: number) => {
      setIsTranslating(true);
      await translateText(
        groupedSentences[index].join(" "),
        selectedLanguage,
        index,
        properNouns
      );
      setIsTranslating(false);
    },
    [groupedSentences, properNouns, selectedLanguage, translateText]
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
    if (translatedText) {
      saveTranslation(
        translatedText,
        groupedSentences[currentIndex].join(" "),
        currentIndex
      );
      setTranslatedIndexes((prev) => new Set([...prev, currentIndex]));
      setCompletedIndexes((prev) => new Set([...prev, currentIndex]));
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
      const hash = await generateFileHash(file); // ✅ 해시 생성
      setFileHash(hash); // ✅ 상태 저장
      const pdfBuffer = await loadPdf(file);
      const extractedText = await extractTextFromPdf(pdfBuffer);
      handleTextExtracted(extractedText, file.name);
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
              <PdfUploader onTextExtracted={handleTextExtracted} />
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
        <div className="w-[600px] bg-white/90 border-l border-gray-100 shadow-inner flex flex-col rounded-l-3xl">
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
            <SavedTranslations
              savedTranslations={savedTranslations ?? []}
              groupedSentences={groupedSentences}
              currentIndex={currentIndex}
              onCopyAll={copyAllTranslations}
              updateTranslation={updateTranslation}
              onSentenceSelect={handleSentenceSelect}
            />
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
