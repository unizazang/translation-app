"use client";

import { useState } from "react";
import PdfUploader from "@/components/PdfUploader";
import TranslationResult from "@/components/TranslationResult";
import LanguageSelector from "@/components/LanguageSelector";
import TranslationCard from "@/components/TranslationCard";
import { useTextProcessing } from "@/hooks/useTextProcessing";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const [pdfText, setPdfText] = useState<string>(""); // 원본 텍스트
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en"); // 기본값: 영어
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 현재 번역할 문장 그룹의 인덱스

  const { groupedSentences, processText } = useTextProcessing(); // 문장 그룹화 훅
  const { translations, translateText } = useTranslation(); // 번역 훅

  // PDF에서 텍스트 추출 시 문장 그룹화 실행
  const handleTextExtracted = (extractedText: string) => {
    setPdfText(extractedText);
    processText(extractedText); // 문장 그룹화 실행
    setCurrentIndex(0); // 첫 번째 문장 그룹부터 시작
  };

  // 번역 실행 함수
  const handleTranslate = () => {
    if (groupedSentences[currentIndex]) {
      translateText(groupedSentences[currentIndex].join(" "), selectedLanguage);
    }
  };

  // 다음 문장으로 이동
  const handleNext = () => {
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      handleTranslate(); // 다음 문장 자동 번역
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">PDF 번역기</h1>

      {/* 원본 언어 선택 */}
      <LanguageSelector onSelectLanguage={setSelectedLanguage} />

      {/* PDF 업로드 */}
      <PdfUploader onTextExtracted={handleTextExtracted} />

      {/* 번역 실행 버튼 */}
      <button
        onClick={handleTranslate}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        번역하기
      </button>

      {/* 현재 번역 중인 문장 그룹 표시 */}
      <div>
        {groupedSentences.length > 0 && (
          <TranslationCard
            originalText={groupedSentences[currentIndex].join(" ")}
            translations={translations}
          />
        )}
      </div>

      {/* 다음 문장 버튼 */}
      {currentIndex < groupedSentences.length - 1 && (
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-500 text-white rounded mt-4"
        >
          다음 문장
        </button>
      )}
    </div>
  );
}
