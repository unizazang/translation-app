export function groupSentences(text: string): string[][] {
  console.log("🚀 groupSentences 실행됨! 원본 텍스트:", text);

  // ✅ "p. 숫자" 같은 패턴 예외 처리
  const modifiedText = text.replace(/p\.\s*(\d+)/g, "p$1");

  // ✅ 문장 분리 (p. 숫자 예외 처리 반영)
  const sentences =
    modifiedText.match(
      /(?<!\b(?:p|pp|Dr|Mr|Ms|vs|etc))\s*[^.!?]+(?:\.\s*\d+|[.!?])/g
    ) || [];

  console.log("🔸 분리된 문장 리스트:", sentences);

  const groupedSentences: string[][] = [];
  let tempGroup: string[] = [];
  let tempLength = 0;

  const MIN_GROUP_LENGTH = 150; // 최소 그룹 길이 (문자 수)
  const MAX_GROUP_LENGTH = 250; // 최대 그룹 길이 (문자 수)
  const LONG_SENTENCE_THRESHOLD = 200; // 너무 긴 문장 기준 (200자 이상)
  const SHORT_SENTENCE_THRESHOLD = 50; // 너무 짧은 문장 기준 (50자 이하)

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    const sentenceLength = sentence.length;

    // 🔹 문장이 너무 길면 강제로 분할
    if (sentenceLength > LONG_SENTENCE_THRESHOLD) {
      const splitSentences = sentence.match(/.{1,100}/g) || [sentence];
      for (const part of splitSentences) {
        if (tempLength + part.length > MAX_GROUP_LENGTH) {
          groupedSentences.push([...tempGroup]);
          tempGroup = [];
          tempLength = 0;
        }
        tempGroup.push(part);
        tempLength += part.length;
      }
      continue;
    }

    // 🔹 문장이 너무 짧으면 다음 문장과 합치기
    if (
      tempLength + sentenceLength < MIN_GROUP_LENGTH ||
      sentenceLength < SHORT_SENTENCE_THRESHOLD
    ) {
      tempGroup.push(sentence);
      tempLength += sentenceLength;
      continue;
    }

    // 🔹 현재 그룹이 적당한 길이면 그룹에 추가
    tempGroup.push(sentence);
    tempLength += sentenceLength;

    // 🔹 그룹이 적당한 크기를 넘으면 저장 후 초기화
    if (tempLength >= MIN_GROUP_LENGTH && tempLength <= MAX_GROUP_LENGTH) {
      groupedSentences.push([...tempGroup]);
      tempGroup = [];
      tempLength = 0;
    }
  }

  // 🔹 남아있는 문장이 있으면 마지막 그룹에 추가
  if (tempGroup.length > 0) {
    groupedSentences.push(tempGroup);
  }

  console.log("✅ 최종 그룹화된 문장 리스트:", groupedSentences);
  return groupedSentences;
}
