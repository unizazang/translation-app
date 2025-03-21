import { NextRequest, NextResponse } from "next/server";
import { extractTextWithLayout } from "@/lib/pdfProcessor";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 제공되지 않았습니다." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const extractedData = await extractTextWithLayout(buffer);

    return NextResponse.json({ extractedData });
  } catch (error) {
    console.error("❌ 레이아웃 추출 중 오류 발생:", error);
    return NextResponse.json({ error: "레이아웃 추출 실패" }, { status: 500 });
  }
}
