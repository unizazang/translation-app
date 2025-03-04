"use client";

import { useEffect, useState } from "react";
import {
  translateWithGoogle,
  translateWithPapago,
  translateWithDeepL,
} from "@/lib/translationApi";
import {
  replaceProperNounsWithTokens,
  restoreProperNounsFromTokens,
} from "@/lib/properNounHandler";
import { useProperNoun } from "@/hooks/useProperNoun"; // ✅ 고유명사 목록 가져오기
import { cleanExtractedText } from "@/lib/pdfProcessor"; // ✅ 텍스트 정제 추가

const normalizeLanguageForPapago = (lang: string) => {
  if (lang === "zh") return "zh-TW"; // Papago는 "zh"를 지원하지 않으므로 "zh-TW"로 변환
  return lang;
};

export function useTranslation() {
  const { properNouns } = useProperNoun(); // ✅ 사용자 정의 고유명사 목록 가져오기
  const [translations, setTranslations] = useState<{
    google: string;
    papago: string;
    deepL: string;
  }>({
    google: "",
    papago: "",
    deepL: "",
  });

  useEffect(() => {
    console.log("📌 최신 고유명사 목록:", properNouns);
  }, [properNouns]);

  /**
   * ✅ 입력된 텍스트를 번역하는 함수
   */
  const translateText = async (text: string, sourceLang: string) => {
    try {
      const papagoLang = normalizeLanguageForPapago(sourceLang);
      const cleanedText = cleanExtractedText(text); // ✅ 번역 전에 텍스트 정제
      const { transformedText, tokenMap } = replaceProperNounsWithTokens(
        cleanedText, // ✅ 정제된 텍스트를 변환 대상으로 전달
        properNouns
      );

      console.log("🔹 번역 전 정제된 텍스트:", transformedText);

      // ✅ 변환된 텍스트로 번역 실행
      const [google, papago, deepL] = await Promise.all([
        translateWithGoogle(transformedText, sourceLang), // ✅ 수정된 부분 (토큰화된 텍스트 전달)
        translateWithPapago(transformedText, papagoLang),
        translateWithDeepL(transformedText, sourceLang),
      ]);

      console.log("✅ 번역 결과 (Google):", google);
      console.log("✅ 번역 결과 (Papago):", papago);
      console.log("✅ 번역 결과 (DeepL):", deepL);

      setTranslations({
        google: restoreProperNounsFromTokens(google || "", tokenMap),
        papago: restoreProperNounsFromTokens(papago || "", tokenMap),
        deepL: restoreProperNounsFromTokens(deepL || "", tokenMap),
      });

      console.log(
        "🔄 복원된 번역 (Google):",
        restoreProperNounsFromTokens(google || "", tokenMap)
      );
      console.log(
        "🔄 복원된 번역 (Papago):",
        restoreProperNounsFromTokens(papago || "", tokenMap)
      );
      console.log(
        "🔄 복원된 번역 (DeepL):",
        restoreProperNounsFromTokens(deepL || "", tokenMap)
      );
    } catch (error) {
      console.error("🚨 Translation Error:", error);
    }
  };

  // ✅ properNouns 변경 시 기존 번역을 업데이트
  useEffect(() => {
    setTranslations((prev) => ({
      google: restoreProperNounsFromTokens(prev.google, {}),
      papago: restoreProperNounsFromTokens(prev.papago, {}),
      deepL: restoreProperNounsFromTokens(prev.deepL, {}),
    }));
  }, [properNouns]);

  return { translations, translateText };
}
