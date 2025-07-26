"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/auth/client";
import { useTranslationLocal } from "./useTranslationLocal";
import { useTranslationSupabase } from "./useTranslationSupabase";
import type { TranslatedTextBlock } from "@/lib/pdfLayout";
// /types/translation.ts (또는 useTranslation.ts 내부에도 가능)
export type SavedTranslation = {
  idx: number;
  original: string;
  translated: string;
};

export type UseTranslationResult = {
  translations: Record<"google" | "deepL", string>;
  translateText: (
    text: string,
    sourceLang: string,
    idx: number,
    properNouns: string[]
  ) => Promise<void>;
  saveTranslation: (
    translation: string,
    original: string,
    idx: number
  ) => Promise<void>;
  updateTranslation: (
    translated: string,
    original: string,
    idx: number
  ) => Promise<void>;
  savedTranslations: SavedTranslation[] | null;
  copyAllTranslations: () => void;
  autoMove: boolean;
  setAutoMove: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useTranslation(fileHash?: string, fileName?: string) {
  const user = useUser();
  // ✅ 항상 호출하되, user?.id로 방어
  const local = useTranslationLocal();
  const supabase = useTranslationSupabase(
    user?.id ?? "", // <-- null 방지 처리
    fileHash ?? "",
    fileName ?? ""
  );

  const [groupedSentences, setGroupedSentences] = useState<string[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const methods = user ? supabase : local;

  return {
    groupedSentences,
    setGroupedSentences,
    currentIndex,
    setCurrentIndex,
    ...methods, // ✅ 모든 함수/값을 그대로 전달
  };
}
