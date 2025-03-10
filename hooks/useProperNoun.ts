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
    if (typeof window !== "undefined") {
      const storedNouns = localStorage.getItem("properNouns");
      return storedNouns ? (JSON.parse(storedNouns) as ProperNoun[]) : [];
    }
    return [];
  });

  // ✅ 고유명사 목록을 LocalStorage에 저장하고 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("properNouns", JSON.stringify(properNouns));
      console.log("📌 저장된 고유명사 목록:", properNouns);
    }
  }, [properNouns]);

  /**
   * ✅ 고유명사 추가 함수
   */
  const addProperNoun = (original: string, translation: string) => {
    if (
      !original.trim() ||
      properNouns.some((noun: ProperNoun) => noun.original === original) // ✅ 타입 명시
    )
      return; // 중복 방지
    setProperNouns([...properNouns, { original, translation }]);
    console.log("📌 추가된 고유명사:", { original, translation });
  };

  /**
   * ✅ 고유명사 삭제 함수
   */
  const removeProperNoun = (original: string) => {
    setProperNouns(properNouns.filter((noun: ProperNoun) => noun.original !== original));
  };

  /**
   * ✅ 파일에서 고유명사 불러오기 함수
   */
  const addProperNounsFromFile = (fileContent: string) => {
    const newNouns: ProperNoun[] = [];
    const lines = fileContent.split("\n");

    lines.forEach((line: string) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // 빈 줄 무시

      const parts = trimmedLine.split(":");
      if (parts.length < 2) return; // 잘못된 형식 무시

      const original = parts[0].trim();
      const translation = parts.slice(1).join(":").trim(); // ":"가 여러 개 포함된 경우 처리

      if (
        original &&
        translation &&
        !properNouns.some((noun: ProperNoun) => noun.original === original) // ✅ 타입 명시
      ) {
        newNouns.push({ original, translation });
      }
    });

    if (newNouns.length > 0) {
      setProperNouns((prev: ProperNoun[]) => [...prev, ...newNouns]); // ✅ 타입 명시
      console.log(`📌 ${newNouns.length}개의 고유명사가 추가되었습니다.`);
    } else {
      console.warn("⚠️ 추가할 고유명사가 없습니다 (중복 또는 잘못된 형식).");
    }
  };

  return { properNouns, addProperNoun, removeProperNoun, addProperNounsFromFile };
}
