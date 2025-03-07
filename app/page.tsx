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
import "@/fontawesome"; // ✅ FontAwesome 설정 파일 import

export default function Home() {
  const [pdfText, setPdfText] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isPdfUploaded, setIsPdfUploaded] = useState<boolean>(false); // ✅ 추가

  const { groupedSentences, processText } = useTextProcessing();
  const {
    translations,
    translateText,
    saveTranslation,
    updateTranslation, // ✅ 추가
    savedTranslations,
    copyAllTranslations,
  } = useTranslation();

  const { properNouns } = useProperNoun();

  const handleTextExtracted = (extractedText: string) => {
    setPdfText(extractedText);
    processText(extractedText);
    setCurrentIndex(0);
    setIsPdfUploaded(true); // ✅ 추가
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
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white">
      <h1 className="text-3xl font-bold text-gray-800">PDF 번역기</h1>

      {!isPdfUploaded ? (
        <PdfUploader onTextExtracted={handleTextExtracted} />
      ) : (
        <>
          <ProperNounManager />

          <LanguageSelector onSelectLanguage={setSelectedLanguage} />

          <button
            onClick={() => handleTranslate(currentIndex)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={isTranslating}
          >
            {isTranslating ? "번역 중..." : "번역 시작"}
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
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                disabled={isTranslating}
              >
                {isTranslating ? "번역 중..." : "이전 문장"}
              </button>
            )}
            {currentIndex < groupedSentences.length - 1 && (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
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
        </>
      )}

      {isPdfUploaded && (
        <div className="mt-8">
          <PdfUploader onTextExtracted={handleTextExtracted} />
        </div>
      )}
    </div>
  );
}
