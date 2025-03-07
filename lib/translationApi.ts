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

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(
      "🚨 Google Translate Error:",
      (error as any).response?.data || error
    );
    return null;
  }
}

/**
 * Papago 번역 API 호출
 */
export async function translateWithPapago(text: string, sourceLang: string) {
  try {
    const response = await axios.post(
      "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation",
      { source: sourceLang || "auto", target: "ko", text },
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.PAPAGO_API_KEY_ID!,
          "X-NCP-APIGW-API-KEY": process.env.PAPAGO_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.message.result.translatedText;
  } catch (error) {
    console.error(
      "🚨 Papago Translate Error:",
      (error as any).response?.data || error
    );
    return null;
  }
}

/**
 * DeepL 번역 API 호출
 */
export async function translateWithDeepL(text: string, sourceLang: string) {
  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      new URLSearchParams({
        text,
        source_lang: sourceLang.toUpperCase(),
        target_lang: "KO",
      }),
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        },
      }
    );
    return response.data.translations[0].text;
  } catch (error) {
    console.error(
      "🚨 DeepL Translate Error:",
      (error as any).response?.data || error
    );
    return null;
  }
}

/**
 * ✅ Google 번역 API 테스트 함수 추가
 */
export async function testGoogleTranslate(
  inputText: string,
  sourceLang: string = "en",
  targetLang: string = "ko"
) {
  return await translateWithGoogle(inputText, sourceLang, targetLang);
}

/**
 * ✅ Papago 번역 API 테스트 함수 추가
 */
export async function testPapagoTranslate(
  inputText: string,
  sourceLang: string = "en",
  targetLang: string = "ko"
) {
  return await translateWithPapago(inputText, sourceLang);
}

/**
 * ✅ DeepL 번역 API 테스트 함수 추가
 */
export async function testDeepLTranslate(
  inputText: string,
  sourceLang: string = "EN",
  targetLang: string = "KO"
) {
  return await translateWithDeepL(inputText, sourceLang);
}
