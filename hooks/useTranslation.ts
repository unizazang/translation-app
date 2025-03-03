"use client";

import { useState } from "react";
import {
  translateWithGoogle,
  translateWithPapago,
  translateWithDeepL,
} from "@/lib/translationApi";

export function useTranslation() {
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
      const [google, papago, deepL] = await Promise.all([
        translateWithGoogle(text, sourceLang),
        translateWithPapago(text, sourceLang),
        translateWithDeepL(text, sourceLang),
      ]);

      setTranslations({
        google: google || "번역 실패",
        papago: papago || "번역 실패",
        deepL: deepL || "번역 실패",
      });
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  return { translations, translateText };
}
