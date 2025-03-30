import axios from "axios";

/**
 * ✅ Next.js API Route를 통해 Papago 번역 요청
 */
export async function translateWithPapago(text: string, sourceLang: string, targetLang: string = "ko") {
  try {
    const response = await axios.post("/api/translate", {
      text,
      sourceLang,
      targetLang,
      provider: "papago",
    });

    return response.data.translatedText;
  } catch (error) {
    console.error(
      "🚨 Papago Translate Error:",
      (error as any).response?.data || error
    );
    return null;
  }
}

/**
 * ✅ Next.js API Route를 통해 DeepL 번역 요청
 */
export async function translateWithDeepL(text: string, sourceLang: string, targetLang: string = "ko") {
  try {
    const response = await axios.post("/api/translate", {
      text,
      sourceLang,
      targetLang,
      provider: "deepl",
    });

    return response.data.translatedText;
  } catch (error) {
    console.error(
      "🚨 DeepL Translate Error:",
      (error as any).response?.data || error
    );
    return null;
  }
}

/**
 * ✅ Google 번역 API 호출 (클라이언트에서 직접 요청)
 */
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
export async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLang: string = "ko"
) {
  try {
    console.log("🔹 Google API 요청 시작:", text, sourceLang, targetLang);
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        q: text,
        source: sourceLang || "auto",
        target: targetLang,
        format: "text",
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(
      "🚨 Google Translate Error:",
      (error as any).response?.data || error
    );
    return null;
  }
}
