import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// ✅ 환경 변수에서 올바른 값 가져오기
const PAPAGO_API_KEY_ID = process.env.PAPAGO_API_KEY_ID;
const PAPAGO_API_KEY = process.env.PAPAGO_API_KEY;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, provider } = await req.json();
    let translatedText = "";

    if (provider === "papago") {
      console.log("🔹 Papago API 요청 시작:", text);

      const response = await axios.post(
        "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation", // ✅ URL 수정
        { source: sourceLang || "auto", target: "ko", text }, // ✅ 요청 바디 수정
        {
          headers: {
            "X-NCP-APIGW-API-KEY-ID": PAPAGO_API_KEY_ID!, // ✅ 헤더 수정
            "X-NCP-APIGW-API-KEY": PAPAGO_API_KEY!,
            "Content-Type": "application/json",
          },
        }
      );

      translatedText = response.data.message.result.translatedText;
    }

    if (provider === "deepl") {
      const response = await axios.post(
        "https://api-free.deepl.com/v2/translate",
        new URLSearchParams({
          text,
          source_lang: sourceLang.toUpperCase(),
          target_lang: "KO",
        }),
        {
          headers: { Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}` },
        }
      );

      translatedText = response.data.translations[0].text;
    }

    return NextResponse.json({ translatedText }, { status: 200 });
  } catch (error) {
    console.error(
      "🚨 API Translation Error:",
      (error as any).response?.data || error
    );
    return NextResponse.json(
      { error: "번역 요청 중 오류 발생" },
      { status: 500 }
    );
  }
}
