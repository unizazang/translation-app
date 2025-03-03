import axios from "axios";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const PAPAGO_CLIENT_ID = process.env.NEXT_PUBLIC_PAPAGO_CLIENT_ID;
const PAPAGO_CLIENT_SECRET = process.env.NEXT_PUBLIC_PAPAGO_CLIENT_SECRET;
const DEEPL_API_KEY = process.env.NEXT_PUBLIC_DEEPL_API_KEY;

/**
 * Google 번역 API 호출
 */

export async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLang = "ko"
) {
  try {
    console.log("🔹 Google API 요청 시작:", text, sourceLang); // ✅ 요청 로그 추가

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        q: text,
        source: sourceLang || "auto", // ✅ sourceLang이 없으면 "auto"로 자동 감지
        target: targetLang,
        format: "text",
      }
    );

    console.log("✅ Google API 응답:", response.data); // ✅ 응답 로그 추가
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("🚨 Google Translate Error:", error.response?.data || error);
    return null;
  }
}

/**
 * Papago 번역 API 호출
 */
export async function translateWithPapago(text: string, sourceLang: string) {
  try {
    const response = await axios.post("/api/translate", {
      text,
      sourceLang,
      provider: "papago",
    });

    console.log("Papago 응답:", response.data);
    return response.data.translatedText;
  } catch (error) {
    console.error("Papago Translate Error:", error.response?.data || error);
    return null;
  }
}

export async function translateWithDeepL(text: string, sourceLang: string) {
  try {
    const response = await axios.post("/api/translate", {
      text,
      sourceLang,
      provider: "deepl",
    });

    console.log("DeepL 응답:", response.data);
    return response.data.translatedText;
  } catch (error) {
    console.error("DeepL Translate Error:", error.response?.data || error);
    return null;
  }
}
