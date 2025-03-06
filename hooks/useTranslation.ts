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

  // ✅ 저장된 번역 목록을 관리하는 상태 추가
  const [savedTranslations, setSavedTranslations] = useState<string[]>([]);

  useEffect(() => {
    console.log("📌 최신 고유명사 목록:", properNouns);
  }, [properNouns]);

  /**
   * 입력된 텍스트를 번역하는 함수
   */
  const translateText = async (text: string, sourceLang: string) => {
    try {
      const papagoLang = normalizeLanguageForPapago(sourceLang);
      const cleanedText = cleanExtractedText(text);
      const { transformedText, tokenMap } = replaceProperNounsWithTokens(
        text,
        properNouns
      );

      console.log("🔹 번역 전 정제된 텍스트:", transformedText);

      const [google, papago, deepL] = await Promise.all([
        translateWithGoogle(transformedText, sourceLang),
        translateWithPapago(transformedText, papagoLang),
        translateWithDeepL(transformedText, sourceLang),
      ]);

      console.log("✅ 번역 결과 (Google):", google);
      console.log("✅ 번역 결과 (Papago):", papago);
      console.log("✅ 번역 결과 (DeepL):", deepL);

      setTranslations({
        google: restoreProperNounsFromTokens(google || "", tokenMap),
        papago: restoreProperNounsFromTokens(papago || "", tokenMap),
        deepL: restoreProperNounsFromTokens(deepL || "", tokenMap),
      });
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
      localStorage.setItem("savedTranslations", JSON.stringify(updatedList));
      return updatedList;
    });
  };

  /**
   * ✅ 번역 결과 삭제 함수
   */
  const removeTranslation = (translation: string) => {
    setSavedTranslations((prev) => {
      const updatedList = prev.filter((item) => item !== translation);
      localStorage.setItem("savedTranslations", JSON.stringify(updatedList));
      return updatedList;
    });
  };

  return {
    translations,
    translateText,
    saveTranslation,
    removeTranslation,
    savedTranslations,
  };
}
