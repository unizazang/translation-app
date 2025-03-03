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
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Google Translate Error:", error);
    return null;
  }
}

/**
 * Papago 번역 API 호출
 */
export async function translateWithPapago(
  text: string,
  sourceLang: string,
  targetLang = "ko"
) {
  try {
    const response = await axios.post(
      "https://openapi.naver.com/v1/papago/n2mt",
      { source: sourceLang, target: targetLang, text },
      {
        headers: {
          "X-Naver-Client-Id": PAPAGO_CLIENT_ID,
          "X-Naver-Client-Secret": PAPAGO_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.message.result.translatedText;
  } catch (error) {
    console.error("Papago Translate Error:", error);
    return null;
  }
}

/**
 * DeepL 번역 API 호출
 */
export async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetLang = "KO"
) {
  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      new URLSearchParams({
        text,
        source_lang: sourceLang.toUpperCase(),
        target_lang: targetLang.toUpperCase(),
      }),
      {
        headers: { Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}` },
      }
    );
    return response.data.translations[0].text;
  } catch (error) {
    console.error("DeepL Translate Error:", error);
    return null;
  }
}
