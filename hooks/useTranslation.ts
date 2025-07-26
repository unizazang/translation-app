"use client";

import { useState } from "react";
import { useUser } from "@/app/auth/client";
import { useTranslationLocal } from "@/hooks/useTranslationLocal";
import { useTranslationSupabase } from "@/hooks/useTranslationSupabase";

/**
 * 번역 훅 (로컬 + Supabase 조건 분기)
 */
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

  // ✅ Supabase 조건을 user뿐 아니라 fileHash, fileName도 확인
  const shouldUseSupabase =
    !!user?.id &&
    !!fileHash &&
    fileHash.length > 0 &&
    !!fileName &&
    fileName.length > 0;

  const methods = shouldUseSupabase ? supabase : local;

  return {
    groupedSentences,
    setGroupedSentences,
    currentIndex,
    setCurrentIndex,
    ...methods, // ✅ 모든 함수/값을 그대로 전달
  };
}
