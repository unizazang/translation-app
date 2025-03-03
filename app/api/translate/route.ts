import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const PAPAGO_CLIENT_ID = process.env.PAPAGO_CLIENT_ID;
const PAPAGO_CLIENT_SECRET = process.env.PAPAGO_CLIENT_SECRET;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, provider } = await req.json();
    let translatedText = "";

    if (provider === "papago") {
      console.log("🔹 Papago API 요청 시작:", text); // ✅ 요청 로그 추가

      const response = await axios.post(
        "https://openapi.naver.com/v1/papago/n2mt",
        { source: sourceLang, target: "ko", text },
        {
          headers: {
            "X-Naver-Client-Id": PAPAGO_CLIENT_ID!,
            "X-Naver-Client-Secret": PAPAGO_CLIENT_SECRET!,
            "Content-Type": "application/json",
          },
        }
      );

      translatedText = response.data.message.result.translatedText;
    }

    if (provider === "deepl") {
      console.log("🔹 DeepL API 요청 시작:", text);

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

      console.log("✅ DeepL API 응답:", response.data); // 응답 로그 추가
      translatedText = response.data.translations[0].text;
    }

    // ✅ 모든 경우에서 `NextResponse.json()` 반환 필수
    return NextResponse.json({ translatedText }, { status: 200 });
  } catch (error) {
    console.error("🚨 API Translation Error:", error.response?.data || error);
    return NextResponse.json(
      { error: "번역 요청 중 오류 발생" },
      { status: 500 }
    );
  }
}
