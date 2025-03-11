"use client";

import { useState, useEffect } from "react";

interface ProperNoun {
  original: string;
  translation: string;
}

/**
 * ✅ 고유명사 관리 커스텀 훅
 */
export function useProperNoun() {
  const STORAGE_KEY = "properNouns";
  const [properNouns, setProperNouns] = useState<ProperNoun[]>(() => {
    if (typeof window !== "undefined") {
      const storedNouns = localStorage.getItem(STORAGE_KEY);
      return storedNouns ? (JSON.parse(storedNouns) as ProperNoun[]) : [];
    }
    return [];
  });

  // ✅ 고유명사 목록을 LocalStorage에 저장하고 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properNouns));
      console.log("📌 저장된 고유명사 목록:", properNouns);
    }
  }, [properNouns]);

  /**
   * ✅ 고유명사 추가 함수
   */
  const addProperNoun = (original: string, translation: string) => {
    if (!original.trim() || properNouns.some((noun) => noun.original === original)) return;
    setProperNouns([...properNouns, { original, translation }]);
    console.log("📌 추가된 고유명사:", { original, translation });
  };

  /**
   * ✅ 고유명사 삭제 함수
   */
  const removeProperNoun = (original: string) => {
    setProperNouns(properNouns.filter((noun) => noun.original !== original));
  };

  /**
   * ✅ 파일에서 고유명사 불러오기 함수
   */
  const addProperNounsFromFile = (fileContent: string) => {
    const newNouns: ProperNoun[] = [];
    const lines = fileContent.split("\n");

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      const parts = trimmedLine.split(":");
      if (parts.length < 2) return;

      const original = parts[0].trim();
      const translation = parts.slice(1).join(":").trim();

      if (original && translation && !properNouns.some((noun) => noun.original === original)) {
        newNouns.push({ original, translation });
      }
    });

    if (newNouns.length > 0) {
      setProperNouns((prev) => [...prev, ...newNouns]);
      console.log(`📌 ${newNouns.length}개의 고유명사가 추가되었습니다.`);
    }
  };

  /**
   * ✅ 고유명사 목록 초기화 함수 (완전 삭제)
   */
  const resetAllProperNouns = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProperNouns([]);
    console.log("🔄 모든 고유명사가 완전히 삭제되었습니다.");
  };

  return {
    properNouns,
    addProperNoun,
    removeProperNoun,
    addProperNounsFromFile,
    resetAllProperNouns, // ✅ 추가
  };
}
