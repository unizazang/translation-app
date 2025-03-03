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
    const [google, papago, deepL] = await Promise.all([
      translateWithGoogle(text, sourceLang),
      translateWithPapago(text, sourceLang),
      translateWithDeepL(text, sourceLang),
    ]);

    setTranslations({
      google: google || "",
      papago: papago || "",
      deepL: deepL || "",
    });
  };

  return { translations, translateText };
}
