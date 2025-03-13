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
import { cleanExtractedText } from "@/lib/pdfProcessor"; // ✅ 올바르게 import

const normalizeLanguageForPapago = (lang: string) => {
  if (lang === "zh") return "zh-TW";
  return lang;
};

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

  // ✅ 번역 결과를 캐싱하는 상태 추가
  const [cachedTranslations, setCachedTranslations] = useState<{
    [key: number]: {
      google: string;
      papago: string;
      deepL: string;
    };
  }>({});

  // ✅ 로컬 스토리지에서 번역 불러오기
  useEffect(() => {
    const storedTranslations = localStorage.getItem(STORAGE_KEY);
    if (storedTranslations) {
      setSavedTranslations(JSON.parse(storedTranslations));
    }
  }, []);

  // ✅ localStorage가 변경될 때 자동 저장
  useEffect(() => {
    if (savedTranslations.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTranslations));
    }
  }, [savedTranslations]);

  /**
   * ✅ 번역 목록 초기화 함수 (전체 삭제)
   */
  const resetAllTranslations = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedTranslations([]);
    console.log("🔄 모든 번역이 완전히 삭제되었습니다.");
  };

  /**
   * ✅ 입력된 텍스트를 번역하는 함수
   */
  const translateText = async (
    text: string,
    sourceLang: string,
    index: number
  ) => {
    try {
      if (cachedTranslations[index]) {
        setTranslations(cachedTranslations[index]);
        return;
      }

      const papagoLang = normalizeLanguageForPapago(sourceLang);
      const cleanedText = cleanExtractedText(text); // ✅ 텍스트 정제 적용

      const [google, papago, deepL] = await Promise.all([
        translateWithGoogle(cleanedText, sourceLang),
        translateWithPapago(cleanedText, papagoLang),
        translateWithDeepL(cleanedText, sourceLang),
      ]);

      const newTranslations = {
        google: google || "",
        papago: papago || "",
        deepL: deepL || "",
      };

      setTranslations(newTranslations);
      setCachedTranslations((prev) => ({
        ...prev,
        [index]: newTranslations,
      }));
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    });
  };

  return {
    translations,
    translateText,
    saveTranslation,
    updateTranslation,
    savedTranslations,
    resetAllTranslations,
  };
}
