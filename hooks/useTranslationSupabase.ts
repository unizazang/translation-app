"use client";

import { useEffect, useState } from "react";
import {
  getOrCreateHistory,
  getSavedTranslations,
  upsertSavedTranslation,
} from "@/lib/supabase/translation";

type TranslationResult = {
  google: string;
  deepL: string;
};

type SavedTranslation = {
  idx: number;
  original: string;
  translated: string;
};

export function useTranslationSupabase(
  userId: string | null,
  fileHash: string,
  fileName: string
) {
  const [translations, setTranslations] = useState<
    Record<number, TranslationResult>
  >({});
  const [savedTranslations, setSavedTranslations] = useState<
    SavedTranslation[] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoMove, setAutoMove] = useState(false);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false); // ✅ 추가

  // ✅ 히스토리 로딩
  useEffect(() => {
    const shouldLoad =
      typeof userId === "string" &&
      userId.length > 0 &&
      typeof fileHash === "string" &&
      fileHash.length > 0 &&
      typeof fileName === "string" &&
      fileName.length > 0;

    if (!shouldLoad) {
      console.warn("⚠️ useTranslationSupabase: 조건 불충족으로 load() 스킵", {
        userId,
        fileHash,
        fileName,
      });
      return;
    }

    console.log("🚀 useTranslationSupabase 시작", {
      userId,
      fileHash,
      fileName,
    });
    const load = async () => {
      const id = await getOrCreateHistory(fileHash, fileName, userId);
      if (!id) {
        console.warn("⛔️ getOrCreateHistory 실패 → historyId null");
        return;
      } else {
        setHistoryId(id);
      }

      const saved = await getSavedTranslations(id);
      setSavedTranslations(saved);
    };

    load();
  }, [userId, fileHash, fileName]);

  useEffect(() => {
    if (!userId || !fileHash || !fileName) return;

    console.log("📌 useEffect 트리거됨 - fileHash or fileName 변경", {
      fileHash,
      fileName,
      userId: userId,
    });
  }, [fileHash, fileName, userId]);

  // ✅ 번역 및 저장
  // ✅ 번역 및 저장
  const translateText = async (
    text: string,
    sourceLang: string,
    idx: number,
    properNouns: { original: string; translation: string }[]
  ) => {
    console.log("🔥 translateText 진입", {
      fileHash,
      fileName,
      historyId,
    });
    if (!fileHash || !fileName || !historyId) {
      console.warn("⛔️ translateText 실행 조건 미충족", {
        fileHash,
        fileName,
        historyId,
      });
      return;
    }

    setIsTranslating(true); // ✅ 시작 전 설정

    try {
      console.log("📤 [translateText] API 요청 시작", {
        text,
        sourceLang,
        idx,
        properNouns,
      });

      const res = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({ text, sourceLang, properNouns }),
      });

      console.log("📨 [translateText] 응답 status:", res.status);

      const data = await res.json();
      console.log("📩 [translateText] 응답 data:", data);

      const result: TranslationResult = {
        google: data?.result?.google ?? "",
        deepL: data?.result?.deepL ?? "",
      };

      setTranslations((prev) => ({
        ...prev,
        [idx]: result,
      }));

      const best = result.google || result.deepL;
      await saveTranslation(best, text, idx);

      console.log("✅ [translateText] 저장까지 완료");
    } catch (e) {
      console.error("❌ [translateText] 오류:", e);
    } finally {
      setIsTranslating(false); // ✅ 항상 종료
    }
  };

  const saveTranslation = async (
    translated: string,
    original: string,
    idx: number
  ) => {
    if (!historyId) {
      console.warn("❌ 저장 실패: historyId 없음", { historyId });
      return;
    }

    await upsertSavedTranslation(historyId, { original, translated, idx });

    console.log("📦 저장 시작", {
      historyId,
      idx,
      translated,
      original,
    });

    const updatedList = [...(savedTranslations ?? [])];
    const existingIndex = updatedList.findIndex((item) => item.idx === idx);
    if (existingIndex !== -1) {
      updatedList[existingIndex] = { original, translated, idx };
    } else {
      updatedList.push({ original, translated, idx });
    }

    setSavedTranslations(updatedList);
  };

  const updateTranslation = async (
    translated: string,
    original: string,
    idx: number
  ) => {
    await saveTranslation(translated, original, idx);
  };

  const copyAllTranslations = () => {
    const sorted = [...(savedTranslations ?? [])].sort((a, b) => a.idx - b.idx);
    const text = sorted.map((item) => item.translated).join("\n\n");
    navigator.clipboard.writeText(text);
  };

  return {
    translations,
    translateText,
    saveTranslation,
    updateTranslation,
    savedTranslations,
    copyAllTranslations,
    setCurrentIndex,
    autoMove,
    setAutoMove,
    isTranslating, // ✅ 반환 추가
  };
}
