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
import { cleanExtractedText } from "@/lib/pdfProcessor";

export default function Home() {
  const [pdfText, setPdfText] = useState<string>(""); // 원본 텍스트
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en"); // 기본값: 영어
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 현재 번역할 문장 그룹의 인덱스
  const [isTranslating, setIsTranslating] = useState<boolean>(false); // 번역 중 여부

  const { groupedSentences, processText } = useTextProcessing(); // 문장 그룹화 훅
  const { translations, translateText } = useTranslation(); // 번역 훅

  const { properNouns } = useProperNoun(); // ✅ 고유명사 목록 가져오기

  // PDF에서 텍스트 추출 시 문장 그룹화 실행
  const handleTextExtracted = (extractedText: string) => {
    const cleanedText = cleanExtractedText(extractedText); // ✅ 텍스트 정제
    setPdfText(cleanedText);
    processText(cleanedText); // ✅ 정제된 텍스트로 문장 그룹화 실행
    setCurrentIndex(0); // 첫 번째 문장 그룹부터 시작
  };

  // 번역 실행 함수
  const handleTranslate = async () => {
    if (groupedSentences[currentIndex]) {
      setIsTranslating(true); // 🔹 번역 시작 시 상태 변경
      await translateText(
        groupedSentences[currentIndex].join(" "),
        selectedLanguage
      );
      setIsTranslating(false); // 🔹 번역 완료 후 상태 변경
    }
  };

  // ✅ currentIndex가 변경될 때 자동으로 번역 실행
  useEffect(() => {
    if (groupedSentences.length > 0) {
      handleTranslate();
    }
  }, [currentIndex]); // 🔹 currentIndex가 변경될 때 실행

  // 다음 문장으로 이동 (currentIndex 변경 → useEffect에서 번역 실행)
  const handleNext = () => {
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">PDF 번역기</h1>

      {/* 🔹 고유명사 관리 UI 추가 */}
      <ProperNounManager />

      {/* 원본 언어 선택 */}
      <LanguageSelector onSelectLanguage={setSelectedLanguage} />

      {/* PDF 업로드 */}
      <PdfUploader onTextExtracted={handleTextExtracted} />

      {/* 번역 실행 버튼 (최초 번역 실행) */}
      <button
        onClick={handleTranslate}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={isTranslating} // 🔹 번역 중이면 버튼 비활성화
      >
        {isTranslating ? "번역 중..." : "번역하기"}
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
          disabled={isTranslating} // 🔹 번역 중이면 버튼 비활성화
        >
          {isTranslating ? "번역 중..." : "다음 문장"}
        </button>
      )}
    </div>
  );
}
