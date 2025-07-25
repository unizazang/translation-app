"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/auth/client";
import { useTranslationLocal } from "./useTranslationLocal";
import { useTranslationSupabase } from "./useTranslationSupabase";
import type { TranslatedTextBlock } from "@/lib/pdfLayout";

export function useTranslation(fileHash: string, fileName: string) {
  const [groupedSentences, setGroupedSentences] = useState<string[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const user = useUser();

  const methods = user
    ? useTranslationSupabase(user.id, fileHash, fileName)
    : useTranslationLocal(fileHash);

  return {
    groupedSentences,
    setGroupedSentences,
    currentIndex,
    setCurrentIndex,
    ...methods, // ✅ 모든 함수/값을 그대로 전달
  };
}
