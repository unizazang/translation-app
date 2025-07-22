import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// ✅ 환경 변수에서 API 키 가져오기
const PAPAGO_API_KEY_ID = process.env.PAPAGO_API_KEY_ID;
const PAPAGO_API_KEY = process.env.PAPAGO_API_KEY;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, targetLang, provider } = await req.json();
    let translatedText = "";

    if (provider === "papago") {
      console.log("🔹 Papago API 요청 시작:", text);
      const response = await axios.post(
        "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation",
        { source: sourceLang || "auto", target: targetLang || "ko", text },
        {
          headers: {
            "X-NCP-APIGW-API-KEY-ID": PAPAGO_API_KEY_ID!,
            "X-NCP-APIGW-API-KEY": PAPAGO_API_KEY!,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
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
          target_lang: (targetLang || "ko").toUpperCase(),
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
      "🚨 번역 API 요청 중 오류 발생:",
      (error as any).response?.data || error
    );
    return NextResponse.json({ error: "번역 요청 실패" }, { status: 500 });
  }
}
