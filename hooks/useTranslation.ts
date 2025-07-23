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

  const [autoMove, setAutoMove] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<string>("ko");

  const [savedTranslations, setSavedTranslations] = useState<
    {
      original: string;
      translated: string;
    }[]
  >([]);

  const [cachedTranslations, setCachedTranslations] = useState<{
    [key: number]: {
      google: string;
      papago: string;
      deepL: string;
    };
  }>({});

  useEffect(() => {
    const storedTranslations = localStorage.getItem(STORAGE_KEY);
    if (storedTranslations) {
      setSavedTranslations(JSON.parse(storedTranslations));
    }
  }, []);

  useEffect(() => {
    const storedAutoMove = localStorage.getItem("autoMove");
    if (storedAutoMove !== null) {
      setAutoMove(storedAutoMove === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("autoMove", autoMove.toString());
  }, [autoMove]);

  useEffect(() => {
    if (savedTranslations.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTranslations));
    }
  }, [savedTranslations]);

  const resetAllTranslations = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedTranslations([]);
    console.log("🔄 모든 번역이 완전히 삭제되었습니다.");
    setTimeout(() => {
      setSavedTranslations([]);
    }, 0);
  };

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

      // 🔴 이 부분(localStorage 직접 저장)을 삭제했습니다.

      return updatedList;
    });
  };

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
    setTranslations,
    setSavedTranslations,
  };
}
