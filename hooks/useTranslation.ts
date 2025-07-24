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

  // ✅ 저장된 번역 목록을 관리하는 상태
  const [savedTranslations, setSavedTranslations] = useState<
    { original: string; translated: string; idx: number }[] | null
  >(null);

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
      try {
        const parsed = JSON.parse(storedTranslations);
        const migrated = parsed.map((item: any, i: number) => ({
          original: item.original,
          translated: item.translated,
          idx: typeof item.idx === "number" ? item.idx : i,
        }));
        setSavedTranslations(migrated);
      } catch (e) {
        console.error("🚨 저장된 번역 데이터를 불러오는 중 오류 발생:", e);
        setSavedTranslations([]); // ❗ 파싱 실패 시에도 상태를 비워서 렌더링 되도록
      }
    } else {
      setSavedTranslations([]); // ❗ localStorage가 아예 없을 때도 빈 배열로
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
    if (!savedTranslations) return;

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
  const saveTranslation = (
    translation: string,
    original: string,
    idx: number
  ) => {
    setSavedTranslations((prev) => {
      const newEntry = { original, translated: translation, idx };
      const storedTranslations = localStorage.getItem(STORAGE_KEY);
      const existingTranslations: {
        original: string;
        translated: string;
        idx?: number;
      }[] = storedTranslations ? JSON.parse(storedTranslations) : [];

      // 🛠 idx 없는 오래된 데이터가 있을 경우 기본값 -1을 추가하여 일관성 유지
      const migrated = existingTranslations.map((item, i) => ({
        ...item,
        idx: item.idx ?? -1, // fallback idx
      }));

      const updatedList = [...migrated, newEntry];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    });
  };

  /**
   * ✅ 번역 수정 함수 (사용자가 직접 수정 가능)
   */
  const updateTranslation = (idx: number, newText: string) => {
    setSavedTranslations((prev) => {
      if (!prev) return []; // prev가 null이면 빈 배열 반환하여 문제 방지

      const updatedList = prev.map((item) =>
        item.idx === idx ? { ...item, translated: newText } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    });
  };

  /**
   * ✅ 모든 번역을 클립보드에 복사하는 함수
   */
  const copyAllTranslations = () => {
    const allTranslations = (savedTranslations ?? [])
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
    setSavedTranslations,
  };
}
