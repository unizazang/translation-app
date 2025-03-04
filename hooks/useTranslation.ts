"use client";

import { useState } from "react";
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

  /**
   * 입력된 텍스트를 번역하는 함수
   */
  const translateText = async (text: string, sourceLang: string) => {
    try {
      const papagoLang = normalizeLanguageForPapago(sourceLang);
      const { transformedText, tokenMap } = replaceProperNounsWithTokens(
        text,
        properNouns
      );

      console.log("🔹 변환된 텍스트:", transformedText); // ✅ 변환 확인

      // ✅ 변환된 텍스트로 번역 실행 (수정된 부분)
      const [google, papago, deepL] = await Promise.all([
        translateWithGoogle(transformedText, sourceLang),
        translateWithPapago(transformedText, papagoLang), //파파고는 중국어 표기가 달라서 바꿈
        translateWithDeepL(transformedText, sourceLang),
      ]);

      setTranslations({
        google: restoreProperNounsFromTokens(google || "", tokenMap),
        papago: restoreProperNounsFromTokens(papago || "", tokenMap),
        deepL: restoreProperNounsFromTokens(deepL || "", tokenMap),
      });
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  return { translations, translateText };
}
