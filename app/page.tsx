"use client";

import { useState, useEffect } from "react";
import PdfUploader from "@/components/PdfUploader";
import TranslationResult from "@/components/TranslationResult";
import LanguageSelector from "@/components/LanguageSelector";
import TranslationCard from "@/components/TranslationCard";
import { useTextProcessing } from "@/hooks/useTextProcessing";
import { useTranslation } from "@/hooks/useTranslation";

import ProperNounManager from "@/components/ProperNounManager"; // ✅ 추가
import { useProperNoun } from "@/hooks/useProperNoun"; // ✅ 추가
import SavedTranslations from "@/components/SavedTranslations";
import TranslationPagination from "@/components/TranslationPagination";

export default function Home() {
  const [pdfText, setPdfText] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const { groupedSentences, processText } = useTextProcessing();
  const {
    translations,
    translateText,
    saveTranslation,
    savedTranslations,
    copyAllTranslations,
    currentPage,
    changePage,
  } = useTranslation();

  const { properNouns } = useProperNoun();

  const handleTextExtracted = (extractedText: string) => {
    setPdfText(extractedText);
    processText(extractedText);
    setCurrentIndex(0);
  };

  const handleTranslate = async (index: number) => {
    if (groupedSentences[index]) {
      setIsTranslating(true);
      await translateText(
        groupedSentences[index].join(" "),
        selectedLanguage,
        index
      );
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (groupedSentences.length > 0) {
      handleTranslate(currentIndex);
    }
  }, [currentIndex]);

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

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">PDF 번역기</h1>

      <ProperNounManager />

      <LanguageSelector onSelectLanguage={setSelectedLanguage} />

      <PdfUploader onTextExtracted={handleTextExtracted} />

      <button
        onClick={() => handleTranslate(currentIndex)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={isTranslating}
      >
        {isTranslating ? "번역 중..." : "번역하기"}
      </button>

      <div>
        {groupedSentences.length > 0 && (
          <TranslationCard
            originalText={groupedSentences[currentIndex].join(" ")}
            translations={translations}
            onSave={saveTranslation}
          />
        )}
      </div>

      <div className="flex gap-4 mt-4">
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-500 text-white rounded"
            disabled={isTranslating}
          >
            {isTranslating ? "번역 중..." : "이전 문장"}
          </button>
        )}
        {currentIndex < groupedSentences.length - 1 && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-gray-500 text-white rounded"
            disabled={isTranslating}
          >
            {isTranslating ? "번역 중..." : "다음 문장"}
          </button>
        )}
      </div>

      <SavedTranslations
        savedTranslations={savedTranslations}
        onCopyAll={copyAllTranslations}
      />

      <TranslationPagination
        currentPage={currentPage}
        totalPages={savedTranslations.length}
        onPageChange={changePage}
      />
    </div>
  );
}
