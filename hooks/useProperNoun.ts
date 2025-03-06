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
  const [properNouns, setProperNouns] = useState<ProperNoun[]>(() => {
    const storedNouns = localStorage.getItem("properNouns");
    return storedNouns ? JSON.parse(storedNouns) : [];
  });

  // ✅ 고유명사 목록을 LocalStorage에 저장하고 불러오기
  useEffect(() => {
    localStorage.setItem("properNouns", JSON.stringify(properNouns));
    console.log("📌 저장된 고유명사 목록:", properNouns);
  }, [properNouns]);

  /**
   * ✅ 고유명사 추가 함수
   */
  const addProperNoun = (original: string, translation: string) => {
    if (
      !original.trim() ||
      properNouns.some((noun) => noun.original === original)
    )
      return; // 중복 방지
    setProperNouns([...properNouns, { original, translation }]);
    console.log("📌 추가된 고유명사:", { original, translation });
  };

  /**
   * ✅ 고유명사 삭제 함수
   */
  const removeProperNoun = (original: string) => {
    setProperNouns(properNouns.filter((noun) => noun.original !== original));
  };

  return { properNouns, addProperNoun, removeProperNoun };
}
