// /app/api/create-history/route.ts

import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileHash, fileName, userId } = await req.json();

    if (!fileHash || !fileName || !userId) {
      return NextResponse.json(
        { error: "fileHash, fileName, userId는 모두 필수입니다." },
        { status: 400 }
      );
    }

    console.log("📩 요청 데이터:", { userId, fileHash, fileName });

    // 1. 기존 히스토리 존재 확인
    const { data: existing, error: selectError } = await supabaseAdmin
      .from("translation_histories")
      .select("id")
      .eq("user_id", userId)
      .eq("file_hash", fileHash)
      .maybeSingle();

    if (selectError) {
      console.error("❌ SELECT 실패:", selectError.message);
      return NextResponse.json({ error: "DB 조회 실패" }, { status: 500 });
    }

    if (existing) {
      console.log("✅ 기존 히스토리 있음:", existing.id);
      return NextResponse.json({ historyId: existing.id });
    }

    // 2. insert
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("translation_histories")
      .insert([{ user_id: userId, file_hash: fileHash, file_name: fileName }])
      .select()
      .maybeSingle();

    if (insertError) {
      console.error("❌ INSERT 실패:", insertError.message);
      return NextResponse.json({ error: "DB 삽입 실패" }, { status: 500 });
    }

    if (!inserted) {
      console.warn("⚠️ 삽입 후 반환 없음");
      return NextResponse.json(
        { error: "삽입 성공했지만 반환 없음" },
        { status: 500 }
      );
    }

    console.log("✅ INSERT 성공:", inserted.id);
    return NextResponse.json({ historyId: inserted.id });
  } catch (e) {
    console.error("❌ 예외 발생:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
