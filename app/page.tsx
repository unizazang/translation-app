"use client";

export const dynamic = "force-dynamic"; // Next.js 빌드 설정용으로 export

import dynamicComponent from "next/dynamic";
import { useState, useEffect } from "react";
import PdfUploader from "@/components/PdfUploader";
import TranslationResult from "@/components/TranslationResult";
import LanguageSelector from "@/components/LanguageSelector";
import TranslationCard from "@/components/TranslationCard";
import { useTextProcessing } from "@/hooks/useTextProcessing";
import { useTranslation } from "@/hooks/useTranslation";
import { useProperNoun } from "@/hooks/useProperNoun"; // ✅ 고유명사 훅 추가
import HelpButton from "@/components/HelpButton"; // ✅ FAB 버튼 추가
import HelpWidget from "@/components/HelpWidget"; // ✅ HelpWidget 추가


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
  const [isPdfUploaded, setIsPdfUploaded] = useState<boolean>(false); // ✅ 추가
  const [isTranslateButtonVisible, setIsTranslateButtonVisible] =
    useState<boolean>(true); // ✅ 추가

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

      {/* ✅ 첫 화면에서도 ProperNounManager 표시 */}
      <ProperNounManager />

      

        {/* ✅ Help 패널 전체 위젯을 추가 */}
        <HelpWidget />


      {!isPdfUploaded ? (
        <>
          <PdfUploader onTextExtracted={handleTextExtracted} />
        </>
      ) : (
        <>
          <LanguageSelector onSelectLanguage={setSelectedLanguage} />

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
        </>
      )}

      {isPdfUploaded && (
        <div className="mt-10 pt-10">
          <PdfUploader onTextExtracted={handleTextExtracted} />
        </div>
      )}
    </div>
  );
}
