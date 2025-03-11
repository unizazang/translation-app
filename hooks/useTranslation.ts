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

  // ✅ localStorage가 변경될 때 자동 저장 (초기화된 경우 다시 불러오지 않도록 수정)
useEffect(() => {
  if (savedTranslations.length === 0) {
    localStorage.removeItem(STORAGE_KEY); // ✅ 완전히 비울 경우 삭제
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTranslations));
  }
}, [savedTranslations]);


  /**
 * ✅ 번역 목록 초기화 함수 (전체 삭제)
 */
const resetAllTranslations = () => {
  setSavedTranslations([]); // 🔹 상태를 먼저 업데이트하여 UI 반영
  localStorage.removeItem(STORAGE_KEY); // ✅ 로컬 스토리지에서도 삭제
  
  console.log("🔄 모든 번역이 완전히 삭제되었습니다.");
};
  
  /**
   * ✅ 입력된 텍스트를 번역하는 함수
   */
  const translateText = async (
    text: string,
    sourceLang: string,
    index: number,
    properNouns?: { original: string; translation: string }[] // ✅ 선택적 인자로 전달
  ) => {
    try {
      // 캐시된 번역 결과가 있는지 확인
      if (cachedTranslations[index]) {
        setTranslations(cachedTranslations[index]);
        console.log("📌 캐시된 번역 결과 사용:", cachedTranslations[index]);
        return;
      }
      const papagoLang = normalizeLanguageForPapago(sourceLang);

      const cleanedText = cleanExtractedText(text);

      const { transformedText, tokenMap } = replaceProperNounsWithTokens(
        cleanedText,
        properNouns || [] // ✅ properNouns가 없으면 빈 배열([]) 사용
      );

      console.log("📌 번역 전 텍스트:", transformedText); // ✅ 번역 전 텍스트 로그 추가

      const [google, papago, deepL] = await Promise.all([
        translateWithGoogle(transformedText, sourceLang),
        translateWithPapago(transformedText, papagoLang),
        translateWithDeepL(transformedText, sourceLang),
      ]);

      const newTranslations = {
        google: restoreProperNounsFromTokens(google || "", tokenMap),
        papago: restoreProperNounsFromTokens(
          papago?.replace(/PPER_NUN_(\d+)/g, "PPER_NOUN_$1") || "", // ✅ 변형된 토큰 복구
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

  /**
   * ✅ 모든 번역을 클립보드에 복사하는 함수
   */
  const copyAllTranslations = () => {
    const allTranslations = savedTranslations.join("\n");
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
    copyAllTranslations, // ✅ 추가
    resetAllTranslations, // ✅ 추가
  };
}
