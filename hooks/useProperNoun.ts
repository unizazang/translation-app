"use client";

import { useState, useEffect } from "react";

/**
 * ✅ 고유명사 관리 커스텀 훅
 */
export function useProperNoun() {
  const [properNouns, setProperNouns] = useState<string[]>([]);

  // ✅ 고유명사 목록을 LocalStorage에 저장하고 불러오기
  useEffect(() => {
    const storedNouns = localStorage.getItem("properNouns");
    if (storedNouns) {
      setProperNouns(JSON.parse(storedNouns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("properNouns", JSON.stringify(properNouns));
  }, [properNouns]);

  /**
   * ✅ 고유명사 추가 함수
   */
  const addProperNoun = (noun: string) => {
    if (!noun.trim() || properNouns.includes(noun)) return; // 중복 방지
    setProperNouns([...properNouns, noun]);
  };

  /**
   * ✅ 고유명사 삭제 함수
   */
  const removeProperNoun = (noun: string) => {
    setProperNouns(properNouns.filter((item) => item !== noun));
  };

  return { properNouns, addProperNoun, removeProperNoun };
}
