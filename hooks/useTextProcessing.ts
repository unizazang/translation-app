import { useState } from "react";

/**
 * PDF에서 추출한 텍스트를 문장 단위로 나누고, 그룹화하는 커스텀 훅
 */
export function useTextProcessing() {
  const [groupedSentences, setGroupedSentences] = useState<string[][]>([]);

  /**
   * ✅ 문장을 문장부호 (., !, ?) 기준으로 분리하는 함수
   */
  function splitTextIntoSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/) // 문장 구분 기호(., !, ?)를 기준으로 나눔
      .map((sentence) => sentence.trim()) // 앞뒤 공백 제거
      .filter((sentence) => sentence.length > 0); // 빈 문자열 제거
  }

  /**
   * ✅ 문장을 2~3개씩 그룹화하는 함수
   */
  function groupSentences(sentences: string[]): string[][] {
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

  /**
   * ✅ 텍스트를 받아서 문장 분리 후 그룹화하는 함수
   */
  function processText(text: string) {
    const sentences = splitTextIntoSentences(text);
    const grouped = groupSentences(sentences);
    setGroupedSentences(grouped);
  }

  return { groupedSentences, processText };
}
