import { supabase } from "@/lib/supabase-browser";
import { TablesInsert, Tables } from "@/types/supabase";

/**
 * ✅ 번역 히스토리가 없으면 새로 만들고, 있으면 그대로 반환
 */
export async function getOrCreateHistory(
  userId: string,
  fileHash: string,
  fileName: string
): Promise<string | null> {
  console.log("🚩 진입: getOrCreateHistory()");
  console.log("userId:", userId);
  console.log("fileHash:", fileHash);
  console.log("fileName:", fileName);

  if (!supabase) {
    console.error("❌ supabase 클라이언트가 null입니다.");
    return null;
  }

  try {
    // 1. 기존 히스토리 검색
    const {
      data: existing,
      error: selectError,
    }: { data: { id: string } | null; error: PostgrestError | null } =
      await supabase
        .from("translation_histories")
        .select("id")
        .eq("user_id", userId)
        .eq("file_hash", fileHash)
        .maybeSingle();

    if (selectError) {
      console.error("❌ select 에러:", selectError.message);
    }

    if (existing) {
      console.log("✅ 기존 히스토리 존재:", existing.id);
      return existing.id;
    }

    // 2. 없으면 새로 insert
    const {
      data: inserted,
      error: insertError,
    }: {
      data: { id: string } | null;
      error: PostgrestError | null;
    } = await supabase
      .from("translation_histories")
      .insert({
        user_id: userId,
        file_hash: fileHash,
        file_name: fileName,
      })
      .select()
      .maybeSingle();

    if (insertError) {
      console.error("❌ insert 에러:", insertError.message);
      return null;
    }

    if (!inserted) {
      console.warn("⚠️ insert 성공했지만 반환된 데이터 없음");
      return null;
    }

    console.log("✅ 히스토리 insert 성공:", inserted.id);
    return inserted.id;
  } catch (e) {
    console.error("❌ getOrCreateHistory 전체 실패:", e);
    return null;
  }
}

/**
 * ✅ 저장된 번역 목록 조회
 */
export async function getSavedTranslations(
  historyId: string
): Promise<{ original: string; translated: string; idx: number }[]> {
  const { data, error } = await supabase
    .from("translated_sentences")
    .select("original, translated, idx")
    .eq("history_id", historyId)
    .order("idx", { ascending: true });

  if (error) {
    console.error("❌ 번역 불러오기 실패:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * ✅ 번역 결과 저장 (upsert)
 */
export async function upsertSavedTranslation(
  historyId: string,
  {
    idx,
    original,
    translated,
  }: { idx: number; original: string; translated: string }
) {
  const { error } = await supabase
    .from("translated_sentences")
    .upsert({
      history_id: historyId,
      idx,
      original,
      translated,
    } as TablesInsert<"translated_sentences">)
    .eq("history_id", historyId)
    .eq("idx", idx);

  if (error) {
    console.error("❌ 번역 저장 실패:", error.message);
    throw error;
  }
}

export async function getTranslationHistories(userId: string): Promise<
  {
    file_name: string;
    file_hash: string;
    created_at: string | null;
  }[]
> {
  const { data, error } = await supabase
    .from("translation_histories")
    .select("file_name, file_hash, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ 번역 히스토리 불러오기 실패:", error.message);
    return [];
  }

  return data ?? [];
}
