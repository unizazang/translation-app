"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/auth/client";
import { useTranslationLocal } from "./useTranslationLocal";
import { useTranslationSupabase } from "./useTranslationSupabase";
import type { TranslatedTextBlock } from "@/lib/pdfLayout";

// /types/translation.ts (또는 useTranslation.ts 내부에도 가능)

type UpdateTranslationFn = (
  translated: string,
  original: string,
  idx: number
) => Promise<void>;

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
    properNouns: { original: string; translation: string }[]
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

  console.log("✅ useTranslation 시작", { user, fileHash });

  // const isReady = !!fileHash && !!fileName;
  // const isClient = typeof window !== "undefined";

  /* { ...useTranslationSupabase(user.id, fileHash!, fileName!) } // dlfjgrp? */
  /* 다음에 이걸로 바꿨었는데 걍 기존으로 돌려놓음 혹시나 해서
      
      const supabase =
    isReady && user
    ? useTranslationSupabase(user.id, fileHash!, fileName!)
  : isClient
    ? useTranslationLocal()
    : createEmptyTranslationMethods();


      */

  const [groupedSentences, setGroupedSentences] = useState<string[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ 항상 훅을 호출하되 내부에서 조건 분기하도록 설계
  const local = useTranslationLocal();
  const supabase = useTranslationSupabase(
    user?.id ?? null,
    fileHash ?? "",
    fileName ?? ""
  );

  const methods = user ? supabase : local;

  return {
    groupedSentences,
    setGroupedSentences,
    currentIndex,
    setCurrentIndex,
    ...methods, // ✅ translations, translateText 등 포함됨
  };
}

function createEmptyTranslationMethods() {
  return {
    translations: {},
    savedTranslations: [],
    translateText: async () => {},
    saveTranslation: async () => {},
    updateTranslation: async () => {},
    copyAllTranslations: () => {},
    autoMove: false,
    setAutoMove: () => {},
  };
}
