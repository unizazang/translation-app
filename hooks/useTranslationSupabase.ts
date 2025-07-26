"use client";

import { useEffect, useState } from "react";
import {
  upsertSavedTranslation,
  getSavedTranslations,
  getOrCreateHistory,
} from "@/lib/supabase/translation";

type UseTranslationSupabaseReturn = {
  translations: {
    google: string;
    deepL: string;
  }[];
  savedTranslations:
    | {
        original: string;
        translated: string;
        idx: number;
      }[]
    | null;
  translateText: (
    text: string,
    sourceLang: string,
    idx: number,
    properNouns: string[]
  ) => Promise<void>;
  saveTranslation: (
    translated: string,
    original: string,
    idx: number
  ) => Promise<void>;
  updateTranslation: (
    translated: string,
    original: string,
    idx: number
  ) => Promise<void>;
  copyAllTranslations: () => void;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  autoMove: boolean;
  setAutoMove: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useTranslationSupabase(
  userId: string,
  fileHash: string,
  fileName: string
): UseTranslationSupabaseReturn {
  const [translations, setTranslations] = useState<
    { google: string; deepL: string }[]
  >([]);
  const [savedTranslations, setSavedTranslations] = useState<
    { original: string; translated: string; idx: number }[] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoMove, setAutoMove] = useState(false);
  const [historyId, setHistoryId] = useState<string | null>(null);

  const loadSavedTranslations = async () => {
    if (!userId || !fileHash || !fileName) return;
    const id = await getOrCreateHistory(userId, fileHash, fileName);
    setHistoryId(id);
    // ✅ 타입 오류 방지
    if (id) {
      const data = await getSavedTranslations(id);
      setSavedTranslations(data);
    }
  };

  useEffect(() => {
    loadSavedTranslations();
  }, [userId, fileHash, fileName]);

  const translateText = async (
    text: string,
    sourceLang: string,
    idx: number,
    properNouns: string[]
  ) => {
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({ text, sourceLang, properNouns }),
      });
      const data = await res.json();

      const newTranslations = [...translations];
      newTranslations[idx] = {
        google: data.result.google,
        deepL: data.result.deepL,
      };
      setTranslations(newTranslations);
    } catch (error) {
      console.error("❌ 번역 오류:", error);
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
    const all = (savedTranslations ?? []).sort((a, b) => a.idx - b.idx);
    const text = all.map((item) => item.translated).join("\n\n");
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
