export function groupSentences(text: string): string[][] {
  console.log("🚀 groupSentences 함수 실행됨! 원본 텍스트:", text);

  const sentences =
    text.match(
      /(?<!\b(?:p|pp|Dr|Mr|Ms|vs|etc))\s*[^.!?]+(?:\.\s*\d+|[.!?])/g
    ) || [];

  console.log("🔸 분리된 문장 리스트:", sentences);

  const groupedSentences: string[][] = [];
  let tempGroup: string[] = [];

  for (let i = 0; i < sentences.length; i++) {
    tempGroup.push(sentences[i].trim());

    console.log(`🔹 현재 그룹 (${tempGroup.length}개):`, tempGroup);

    if (tempGroup.length === 3 || i === sentences.length - 1) {
      groupedSentences.push(tempGroup);
      tempGroup = [];
    }
  }

  console.log("✅ 최종 그룹화된 문장 리스트:", groupedSentences);
  return groupedSentences;
}
