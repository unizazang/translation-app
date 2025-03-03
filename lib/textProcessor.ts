/**
 * 텍스트를 2~3문장씩 그룹화하는 함수
 */
export function groupSentences(text: string): string[][] {
  const sentences = text.match(/[^.!?]+[.!?]/g) || []; // 문장 단위로 분리
  const groupedSentences: string[][] = [];

  let tempGroup: string[] = [];
  for (let i = 0; i < sentences.length; i++) {
    tempGroup.push(sentences[i].trim());

    // 2~3문장씩 그룹화 (길이가 너무 길면 조절 가능)
    if (tempGroup.length === 3 || i === sentences.length - 1) {
      groupedSentences.push(tempGroup);
      tempGroup = [];
    }
  }

  return groupedSentences;
}
