"use client";

import { useEffect, useState } from "react";
import {
  translateWithGoogle,
  translateWithPapago,
  translateWithDeepL,
} from "@/lib/translationApi";
import {
  replaceProperNounsWithTokens,
  restoreProperNounsFromTokens,
} from "@/lib/properNounHandler";
import { useProperNoun } from "@/hooks/useProperNoun";
import { cleanExtractedText } from "@/lib/pdfProcessor";

const STORAGE_KEY = "savedTranslations";

export function useTranslation() {
  const { properNouns } = useProperNoun();
  const [translations, setTranslations] = useState<{
    google: string;
    papago: string;
    deepL: string;
  }>({
    google: "",
    papago: "",
    deepL: "",
  });

  // ✅ 저장된 번역 목록을 관리하는 상태
  const [savedTranslations, setSavedTranslations] = useState<string[]>([]);

  // ✅ 로컬 스토리지에서 번역 불러오기
  useEffect(() => {
    const storedTranslations = localStorage.getItem(STORAGE_KEY);
    if (storedTranslations) {
      setSavedTranslations(JSON.parse(storedTranslations));
    }
  }, []);

  // ✅ localStorage가 변경될 때 자동 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTranslations));
  }, [savedTranslations]);

  /**
   * ✅ 입력된 텍스트를 번역하는 함수
   */
  const translateText = async (
    text: string,
    sourceLang: string,
    index: number
  ) => {
    try {
      const cleanedText = cleanExtractedText(text);
      const { transformedText, tokenMap } = replaceProperNounsWithTokens(
        cleanedText,
        properNouns
      );

      const [google, papago, deepL] = await Promise.all([
        translateWithGoogle(transformedText, sourceLang),
        translateWithPapago(transformedText, sourceLang),
        translateWithDeepL(transformedText, sourceLang),
      ]);

      const newTranslations = {
        google: restoreProperNounsFromTokens(google || "", tokenMap),
        papago: restoreProperNounsFromTokens(papago || "", tokenMap),
        deepL: restoreProperNounsFromTokens(deepL || "", tokenMap),
      };

      setTranslations(newTranslations);
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  /**
   * ✅ 번역 결과 저장 함수
   */
  const saveTranslation = (translation: string) => {
    setSavedTranslations((prev) => {
      const updatedList = [...prev, translation];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList)); // ✅ localStorage 업데이트
      return updatedList;
    });
  };

  /**
   * ✅ 번역 수정 함수 (사용자가 직접 수정 가능)
   */
  const updateTranslation = (index: number, newText: string) => {
    setSavedTranslations((prev) => {
      const updatedList = [...prev];
      updatedList[index] = newText;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList)); // ✅ localStorage 업데이트
      return updatedList;
    });
  };

  return {
    translations,
    translateText,
    saveTranslation,
    updateTranslation,
    savedTranslations,
  };
}
