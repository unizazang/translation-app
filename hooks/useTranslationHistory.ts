// hooks/useTranslationHistory.ts
"use client";

import { useState, useEffect } from "react";

export interface SavedTranslation {
  original: string;
  translated: string;
  idx: number;
}

export interface TranslationHistoryEntry {
  fileName: string;
  timestamp: string;
  key: string; // localStorage 키명
  data: SavedTranslation[];
}

export function useTranslationHistory() {
  const [historyList, setHistoryList] = useState<TranslationHistoryEntry[]>([]);

  useEffect(() => {
    const allKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("savedTranslations:")
    );

    const entries = allKeys
      .map((key) => {
        try {
          const data: SavedTranslation[] = JSON.parse(
            localStorage.getItem(key) || "[]"
          );
          const fileName = key.replace("savedTranslations:", "");
          const timestamp = localStorage.getItem(`${key}:timestamp`) || "불명";
          return { fileName, key, data, timestamp };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean) as TranslationHistoryEntry[];

    setHistoryList(entries);
  }, []);

  const deleteHistory = (key: string) => {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}:timestamp`);
    setHistoryList((prev) => prev.filter((item) => item.key !== key));
  };

  return { historyList, deleteHistory };
}
