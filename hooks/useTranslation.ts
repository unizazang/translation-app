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

  // 자동 이동 설정 상태 추가
  const [autoMove, setAutoMove] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<string>("ko");

  // ✅ 저장된 번역 목록을 관리하는 상태
  const [savedTranslations, setSavedTranslations] = useState<
    {
      original: string;
      translated: string;
    }[]
  >([]);

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

  // 자동 이동 설정 불러오기
  useEffect(() => {
    const storedAutoMove = localStorage.getItem("autoMove");
    if (storedAutoMove !== null) {
      setAutoMove(storedAutoMove === "true");
    }
  }, []);

  // 자동 이동 설정 저장
  useEffect(() => {
    localStorage.setItem("autoMove", autoMove.toString());
  }, [autoMove]);

  // ✅ localStorage가 변경될 때 자동 저장
  useEffect(() => {
    if (savedTranslations.length === 0) {
      localStorage.removeItem(STORAGE_KEY); // ✅ 데이터가 없으면 완전히 삭제
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTranslations));
    }
  }, [savedTranslations]);

  /**
   * ✅ 번역 목록 초기화 함수 (전체 삭제)
   */
  const resetAllTranslations = () => {
    localStorage.removeItem(STORAGE_KEY); // ✅ 로컬 스토리지에서 삭제
    setSavedTranslations([]); // ✅ 상태 업데이트 요청
    console.log("🔄 모든 번역이 완전히 삭제되었습니다.");

    // ✅ 상태 동기화를 강제 적용하여 즉시 업데이트
    setTimeout(() => {
      setSavedTranslations([]);
    }, 0);
  };

  /**
   * ✅ 입력된 텍스트를 번역하는 함수
   */
  const translateText = async (
    text: string,
    sourceLang: string,
    index: number,
    properNouns?: { original: string; translation: string }[]
  ) => {
    try {
      if (cachedTranslations[index]) {
        setTranslations(cachedTranslations[index]);
        console.log("📌 캐시된 번역 결과 사용:", cachedTranslations[index]);
        return;
      }
      const papagoLang = normalizeLanguageForPapago(sourceLang);
      const papagoTargetLang = normalizeLanguageForPapago(targetLanguage);

      const cleanedText = cleanExtractedText(text);

      const { transformedText, tokenMap } = replaceProperNounsWithTokens(
        cleanedText,
        properNouns || []
      );

      console.log("📌 번역 전 텍스트:", transformedText);

      const [google, papago, deepL] = await Promise.all([
        translateWithGoogle(transformedText, sourceLang, targetLanguage),
        translateWithPapago(transformedText, papagoLang, papagoTargetLang),
        translateWithDeepL(transformedText, sourceLang, targetLanguage),
      ]);

      const newTranslations = {
        google: restoreProperNounsFromTokens(google || "", tokenMap),
        papago: restoreProperNounsFromTokens(
          papago?.replace(/PPER_NUN_(\d+)/g, "PPER_NOUN_$1") || "",
          tokenMap
        ),
        deepL: restoreProperNounsFromTokens(deepL || "", tokenMap),
      };

      setTranslations(newTranslations);
    } catch (error) {
      console.error(
        "Translation Error:",
        (error as any).response?.data || error
      );
    }
  };

  /**
   * ✅ 번역 결과 저장 함수
   */
  const saveTranslation = (translation: string, original: string) => {
    setSavedTranslations((prev) => {
      const storedTranslations = localStorage.getItem(STORAGE_KEY);
      const existingTranslations = storedTranslations
        ? JSON.parse(storedTranslations)
        : [];

      if (existingTranslations.length === 0) {
        return [{ original, translated: translation }];
      }

      const updatedList = [
        ...existingTranslations,
        { original, translated: translation },
      ];
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
      updatedList[index] = {
        ...updatedList[index],
        translated: newText,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    });
  };

  /**
   * ✅ 모든 번역을 클립보드에 복사하는 함수
   */
  const copyAllTranslations = () => {
    const allTranslations = savedTranslations
      .map((t) => t.translated)
      .join("\n");
    navigator.clipboard.writeText(allTranslations).then(() => {
      console.log("📌 모든 번역이 클립보드에 복사되었습니다.");
    });
  };

  return {
    translations,
    translateText,
    saveTranslation,
    updateTranslation,
    savedTranslations,
    copyAllTranslations,
    resetAllTranslations,
    autoMove,
    setAutoMove,
    targetLanguage,
    setTargetLanguage,
  };
}
