"use client";

import { useState, useCallback, useEffect } from "react";
import { useUser } from "@/app/auth/client";
import {
  getOrCreateHistory,
  getSavedTranslations,
  upsertSavedTranslation,
} from "@/lib/supabase/translation";

export function useTranslationSupabase(
  userId: string,
  fileHash: string,
  fileName: string
) {
  const user = useUser();
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
  const [savedTranslations, setSavedTranslations] = useState<
    { original: string; translated: string; idx: number }[] | null
  >(null);

  const [historyId, setHistoryId] = useState<string | null>(null);

  // ✅ 히스토리 ID를 가져오고 저장된 번역 불러오기
  const loadSavedTranslations = useCallback(async () => {
    if (!user || !fileHash || !fileName) return;
    if (historyId) {
      // 이미 존재하는 경우 바로 사용
      const existing = await getSavedTranslations(historyId);
      setSavedTranslations(existing);
      return;
    }

    const id = await getOrCreateHistory(user.id, fileHash, fileName);
    if (!id) return;

    setHistoryId(id);
    const existing = await getSavedTranslations(id);
    setSavedTranslations(existing);
  }, [user, fileHash, fileName, historyId]);

  useEffect(() => {
    loadSavedTranslations();
  }, [loadSavedTranslations]);

  // ✅ Supabase 저장
  const saveTranslation = async (
    translation: string,
    original: string,
    idx: number
  ) => {
    if (!user || !fileHash || !fileName) return;

    let id = historyId;
    if (!id) {
      id = await getOrCreateHistory(user.id, fileHash, fileName);
      if (!id) return;
      setHistoryId(id);
    }

    await upsertSavedTranslation(id, {
      idx,
      original,
      translated: translation,
    });

    const updated = await getSavedTranslations(id);
    setSavedTranslations(updated); // 최신 상태 갱신
  };

  // ✅ Supabase 수정
  const updateTranslation = async (idx: number, newText: string) => {
    if (!historyId || !savedTranslations) return;

    const target = savedTranslations.find((item) => item.idx === idx);
    if (!target) return;

    await upsertSavedTranslation(historyId, {
      idx,
      original: target.original,
      translated: newText,
    });

    const updated = await getSavedTranslations(historyId);
    setSavedTranslations(updated); // 최신 반영
  };

  const copyAllTranslations = () => {
    const allTranslations = (savedTranslations ?? [])
      .map((t) => t.translated)
      .join("\n");

    navigator.clipboard.writeText(allTranslations).then(() => {
      console.log("📌 모든 번역이 클립보드에 복사되었습니다.");
    });
  };

  const resetAllTranslations = () => {
    // 아직 Supabase 전체 삭제 기능 없음
    alert("Supabase에서는 전체 삭제 기능이 아직 구현되지 않았습니다.");
  };

  return {
    translations,
    savedTranslations,
    translateText: () => {}, // 추후 추가
    saveTranslation,
    updateTranslation,
    copyAllTranslations,
    resetAllTranslations,
    autoMove,
    setAutoMove,
  };
}
