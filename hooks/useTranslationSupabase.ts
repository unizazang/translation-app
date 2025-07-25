"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/auth/client";
import {
  getOrCreateHistory,
  getSavedTranslations,
  upsertSavedTranslation,
} from "@/lib/supabase/translation";
import { TranslatedTextBlock } from "@/lib/pdfLayout";
import type { PostgrestError } from "@supabase/supabase-js";

export function useTranslationSupabase(
  userId: string,
  fileHash: string,
  fileName: string
) {
  const [savedTranslations, setSavedTranslations] = useState<
    { idx: number; original: string; translated: string }[] | null
  >(null);

  const [historyId, setHistoryId] = useState<string | null>(null);

  // ✅ 히스토리 ID를 얻고 기존 저장된 번역을 불러옴
  const loadSavedTranslations = async () => {
    if (!userId || !fileHash || !fileName) return;

    try {
      const id = await getOrCreateHistory(userId, fileHash, fileName);
      if (!id) return;

      setHistoryId(id);
      const data = await getSavedTranslations(id);
      setSavedTranslations(data ?? []);
    } catch (error) {
      console.error("❌ 번역 히스토리 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    loadSavedTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, fileHash]);

  // ✅ Supabase 저장
  const saveTranslation = async (
    translation: string,
    original: string,
    idx: number
  ) => {
    if (!userId || !fileHash || !fileName) return;

    let id = historyId;
    if (!id) {
      const generatedId = await getOrCreateHistory(userId, fileHash, fileName);
      if (!generatedId) return;
      setHistoryId(generatedId);
      id = generatedId;
    }

    if (!id || idx === undefined || !original?.trim() || !translation?.trim()) {
      console.warn("⚠️ 저장 생략: 필드 누락");
      return;
    }

    const { error }: { error: PostgrestError | null } =
      await upsertSavedTranslation(id, {
        idx,
        original: original.trim(),
        translated: translation.trim(),
      });

    if (error) {
      console.error("❌ Supabase 저장 실패:", error.message);
    } else {
      const updated = await getSavedTranslations(id);
      setSavedTranslations(updated ?? []);
    }
  };

  // ✅ 수정 (UI에서 호출됨)
  const updateTranslation = async (idx: number, newText: string) => {
    if (!historyId || !savedTranslations) return;

    const target = savedTranslations.find((item) => item.idx === idx);
    if (!target) return;

    const { error }: { error: PostgrestError | null } =
      await upsertSavedTranslation(historyId, {
        idx,
        original: target.original,
        translated: newText.trim(),
      });

    if (error) {
      console.error("❌ 번역 수정 실패:", error.message);
    } else {
      const updated = await getSavedTranslations(historyId);
      setSavedTranslations(updated ?? []);
    }
  };

  const copyAllTranslations = () => {
    const all = (savedTranslations ?? [])
      .map((item) => item.translated)
      .join("\n");

    navigator.clipboard.writeText(all).then(() => {
      console.log("✅ 번역 복사 완료");
    });
  };

  const resetAllTranslations = () => {
    alert("Supabase에서는 전체 삭제 기능이 아직 구현되지 않았습니다.");
  };

  return {
    savedTranslations,
    saveTranslation,
    updateTranslation,
    loadSavedTranslations,
    copyAllTranslations,
    resetAllTranslations,
  };
}
