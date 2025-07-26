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
  const [translations, setTranslations] = useState<{
    google: string;
    papago: string;
    deepL: string;
  }>({
    google: "",
    papago: "",
    deepL: "",
  });

  const [savedTranslations, setSavedTranslations] = useState<
    SavedTranslation[] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoMove, setAutoMove] = useState(false);
  const [historyId, setHistoryId] = useState<string | null>(null);

  // ✅ 히스토리 로딩
  useEffect(() => {
    const load = async () => {
      if (!userId || !fileHash || !fileName) return;

      const id = await getOrCreateHistory(userId, fileHash, fileName);
      if (!id) return;

      setHistoryId(id);

      const saved = await getSavedTranslations(id);
      setSavedTranslations(saved);
    };

    load();
  }, [userId, fileHash, fileName]);

  // ✅ 번역 및 저장
  const translateText = async (
    text: string,
    sourceLang: string,
    idx: number,
    properNouns: { original: string; translation: string }[]
  ) => {
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({ text, sourceLang, properNouns }),
      });

      const data = await res.json();
      const result: TranslationResult = {
        google: data.result.google || "",
        deepL: data.result.deepL || "",
      };

      const updated = [...translations];
      updated[idx] = result;
      setTranslations(updated);

      // 저장도 함께 수행
      const best = result.google || result.deepL;
      await saveTranslation(best, text, idx);
    } catch (e) {
      console.error("❌ 번역 오류:", e);
    }
  };

  const saveTranslation = async (
    translated: string,
    original: string,
    idx: number
  ) => {
    if (!historyId) return;

    await upsertSavedTranslation(historyId, { original, translated, idx });

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
    savedTranslations,
    translateText,
    saveTranslation,
    updateTranslation,
    copyAllTranslations,
    setCurrentIndex,
    autoMove,
    setAutoMove,
  };
}
