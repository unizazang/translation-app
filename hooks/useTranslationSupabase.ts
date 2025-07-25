"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getOrCreateHistory,
  getSavedTranslations,
  saveTranslationToSupabase,
  updateTranslationInSupabase,
} from "@/lib/supabase/translation";
import { useProperNoun } from "@/hooks/useProperNoun";
import { cleanExtractedText } from "@/lib/pdfProcessor";
import {
  replaceProperNounsWithTokens,
  restoreProperNounsFromTokens,
} from "@/lib/properNounHandler";
import {
  translateWithGoogle,
  translateWithPapago,
  translateWithDeepL,
} from "@/lib/translationApi";

const normalizeLanguageForPapago = (lang: string) => {
  if (lang === "zh") return "zh-TW";
  return lang;
};

export function useTranslationSupabase(
  userId: string,
  fileHash: string,
  fileName: string
) {
  const { properNouns } = useProperNoun();

  const [translations, setTranslations] = useState({
    google: "",
    papago: "",
    deepL: "",
  });

  const [autoMove, setAutoMove] = useState<boolean>(false);
  const [savedTranslations, setSavedTranslations] = useState<
    { original: string; translated: string; idx: number }[] | null
  >(null);
  const [cachedTranslations, setCachedTranslations] = useState<{
    [key: number]: {
      google: string;
      papago: string;
      deepL: string;
    };
  }>({});
  const [historyId, setHistoryId] = useState<string | null>(null);

  const loadSavedTranslations = useCallback(async () => {
    if (!userId || !fileHash || !fileName) return;
    const id = await getOrCreateHistory(userId, fileHash, fileName);
    if (!id) return;
    setHistoryId(id);
    const existing = await getSavedTranslations(id);
    setSavedTranslations(existing);
  }, [userId, fileHash, fileName]);

  useEffect(() => {
    loadSavedTranslations();
  }, [loadSavedTranslations]);

  useEffect(() => {
    const stored = localStorage.getItem("autoMove");
    if (stored !== null) setAutoMove(stored === "true");
  }, []);
  useEffect(() => {
    localStorage.setItem("autoMove", autoMove.toString());
  }, [autoMove]);

  const resetAllTranslations = () => {
    setSavedTranslations([]);
    console.log("🔄 모든 번역이 완전히 삭제되었습니다.");
    setTimeout(() => {
      setSavedTranslations([]);
    }, 0);
  };

  const translateText = async (
    text: string,
    sourceLang: string,
    index: number,
    properNounsOverride?: { original: string; translation: string }[]
  ) => {
    if (cachedTranslations[index]) {
      setTranslations(cachedTranslations[index]);
      return;
    }

    const papagoLang = normalizeLanguageForPapago(sourceLang);
    const cleanedText = cleanExtractedText(text);
    const { transformedText, tokenMap } = replaceProperNounsWithTokens(
      cleanedText,
      properNounsOverride || properNouns
    );

    const [google, papago, deepL] = await Promise.all([
      translateWithGoogle(transformedText, sourceLang),
      translateWithPapago(transformedText, papagoLang),
      translateWithDeepL(transformedText, sourceLang),
    ]);

    const newTranslations = {
      google: restoreProperNounsFromTokens(google || "", tokenMap),
      papago: restoreProperNounsFromTokens(
        papago?.replace(/PPER_NUN_(\d+)/g, "PPER_NOUN_$1") || "",
        tokenMap
      ),
      deepL: restoreProperNounsFromTokens(deepL || "", tokenMap),
    };

    setTranslations(newTranslations);
  };

  const saveTranslation = async (
    translation: string,
    original: string,
    idx: number
  ) => {
    if (!historyId) return;
    await saveTranslationToSupabase(historyId, idx, original, translation);

    setSavedTranslations((prev) => {
      const updated = [...(prev || [])];
      const i = updated.findIndex((t) => t.idx === idx);
      if (i !== -1) {
        updated[i] = { idx, original, translated: translation };
      } else {
        updated.push({ idx, original, translated: translation });
      }
      return updated;
    });
  };

  const updateTranslation = async (idx: number, newText: string) => {
    if (!historyId) return;
    await updateTranslationInSupabase(historyId, idx, newText);

    setSavedTranslations((prev) =>
      (prev ?? []).map((item) =>
        item.idx === idx ? { ...item, translated: newText } : item
      )
    );
  };

  const copyAllTranslations = () => {
    const all = (savedTranslations ?? []).map((t) => t.translated).join("\n");
    navigator.clipboard.writeText(all);
  };

  return {
    translations,
    translateText,
    saveTranslation,
    updateTranslation,
    savedTranslations,
    copyAllTranslations,
    resetAllTranslations,
    autoMove,
    setAutoMove,
  };
}
