"use client";

import { useState } from "react";

/**
 * PDF에서 추출한 텍스트를 문장 단위로 나누고, 그룹화하는 커스텀 훅
 */
export function useTextProcessing() {
  const [groupedSentences, setGroupedSentences] = useState<string[][]>([]);

  /**
   * ✅ 기존 버전: 문장을 문장부호 (., !, ?) 기준으로 분리하는 함수 (V1)
   */
  function splitTextIntoSentencesV1(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/) // 문장 구분 기호(., !, ?)를 기준으로 나눔
      .map((sentence) => sentence.trim()) // 앞뒤 공백 제거
      .filter((sentence) => sentence.length > 0); // 빈 문자열 제거
  }

  /**
   * ✅ 기존 그룹화 함수 (V1)
   */
  /* function groupSentencesV1(sentences: string[]): string[][] {
    const grouped: string[][] = [];
    let currentGroup: string[] = [];

    for (const sentence of sentences) {
      currentGroup.push(sentence);

      // 그룹의 길이를 2~3문장 사이로 조정
      if (currentGroup.length >= 2) {
        grouped.push([...currentGroup]);
        currentGroup = [];
      }
    }

    // 마지막 그룹이 남아 있다면 추가
    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }

    return grouped;
  }
    */

  /**
   * ✅ 새로운 버전 (V2): "p. 숫자" 패턴 예외 처리 적용 (이전 그룹화 로직 유지)
   */
  function groupSentencesV2(text: string): string[][] {
    console.log("🚀 groupSentences 실행됨! 원본 텍스트:", text);

    // ✅ "p. 숫자" 패턴을 예외 처리하여 온점(.)을 문장 끝으로 인식하지 않도록 함
    const modifiedText = text.replace(/p\.\s*(\d+)/g, "p$1");

    console.log("🛠 변환된 텍스트 (p. 예외 처리 적용):", modifiedText);

    // ✅ 문장을 분리하는 정규식 (p. 숫자 예외 처리 적용)
    const sentences = modifiedText.match(/[^.!?]+[.!?]+/g) || [];

    console.log("🔸 분리된 문장 리스트:", sentences);

    const groupedSentences: string[][] = [];
    let tempGroup: string[] = [];

    for (let i = 0; i < sentences.length; i++) {
      tempGroup.push(sentences[i].trim());

      // ✅ 그룹 크기 제한 (기본: 2~3 문장씩 그룹화)
      if (tempGroup.length === 3 || i === sentences.length - 1) {
        groupedSentences.push(tempGroup);
        tempGroup = [];
      }
    }

    console.log("✅ 최종 그룹화된 문장들:", groupedSentences);

    return groupedSentences;
  }

  /**
   * ✅ 텍스트를 받아서 문장 분리 후 그룹화하는 함수
   */
  function processText(text: string) {
    console.log("🚀 processText 실행됨! 원본 텍스트:", text);

    // ✅ V1 사용 (기존 코드)
    // const sentences = splitTextIntoSentencesV1(text);
    // const grouped = groupSentencesV1(sentences);

    // ✅ V2 적용 (새로운 코드)
    const grouped = groupSentencesV2(text);

    console.log("✅ processText 내에서 생성된 그룹: ", grouped);
    setGroupedSentences(grouped);
  }

  return { groupedSentences, processText };
}
