"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { Tables, TablesInsert } from "@/types/supabase";

/**
 * ✅ 번역 기록이 존재하지 않으면 새로 생성하고 ID를 반환
 */
export async function getOrCreateHistory(
  userId: string,
  fileHash: string,
  fileName: string
): Promise<string | null> {
  const supabase = supabaseAdmin;

  // 1. 기존 기록 존재 여부 확인
  const { data: existing, error: fetchError } = await supabase
    .from("translation_histories")
    .select("id")
    .eq("user_id", userId)
    .eq("file_hash", fileHash)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("📛 히스토리 조회 오류:", fetchError);
    return null;
  }

  if (existing) {
    return existing.id;
  }

  // 2. 없으면 새로 생성
  const insertData: TablesInsert<"translation_histories"> = {
    user_id: userId,
    file_hash: fileHash,
    file_name: fileName,
  };

  const { data: created, error: insertError } = await supabase
    .from("translation_histories")
    .insert(insertData)
    .select("id")
    .single();

  if (insertError) {
    console.error("📛 히스토리 생성 오류:", insertError);
    return null;
  }

  return created.id;
}

/**
 * ✅ 특정 히스토리의 모든 번역 문장 불러오기
 */
export async function getSavedTranslations(
  historyId: string
): Promise<{ original: string; translated: string; idx: number }[]> {
  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("translated_sentences")
    .select("original, translated, idx")
    .eq("history_id", historyId)
    .order("idx", { ascending: true });

  if (error) {
    console.error("📛 번역 불러오기 오류:", error);
    return [];
  }

  return data;
}

/**
 * ✅ Supabase에 새 번역 저장 (중복 방지)
 */
export async function saveTranslationToSupabase(
  historyId: string,
  idx: number,
  original: string,
  translated: string
): Promise<void> {
  const supabase = supabaseAdmin;

  // 중복 확인
  const { data: existing, error: checkError } = await supabase
    .from("translated_sentences")
    .select("id")
    .eq("history_id", historyId)
    .eq("idx", idx)
    .maybeSingle();

  if (checkError) {
    console.error("📛 중복 확인 실패:", checkError);
    return;
  }

  if (existing) {
    // 이미 있으면 update
    await updateTranslationInSupabase(historyId, idx, translated);
    return;
  }

  // 없으면 insert
  const insertData: TablesInsert<"translated_sentences"> = {
    history_id: historyId,
    idx,
    original,
    translated,
  };

  const { error } = await supabase
    .from("translated_sentences")
    .insert(insertData);

  if (error) {
    console.error("📛 번역 저장 오류:", error);
  }
}

/**
 * ✅ 번역 문장 수정
 */
export async function updateTranslationInSupabase(
  historyId: string,
  idx: number,
  translated: string
): Promise<void> {
  const supabase = supabaseAdmin;

  const { error } = await supabase
    .from("translated_sentences")
    .update({ translated })
    .eq("history_id", historyId)
    .eq("idx", idx);

  if (error) {
    console.error("📛 번역 수정 오류:", error);
  }
}
