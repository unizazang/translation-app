interface ProperNoun {
  original: string;
  translation: string;
}

/**
 * 고유명사를 토큰으로 대체하는 함수
 */
export const replaceProperNounsWithTokens = (
  text: string,
  properNouns: ProperNoun[]
) => {
  let tokenMap: { [key: string]: string } = {};
  let transformedText = text;

  properNouns.forEach((noun, index) => {
    // proper_noun
    const token = `PPER_NOUN_${index}`;
    const regex = new RegExp(`\\b${noun.original}\\b`, "g");
    transformedText = transformedText.replace(regex, token);
    tokenMap[token] = noun.translation;
  });

  console.log("📌 토큰으로 대체된 텍스트:", transformedText);
  console.log("📌 토큰 맵:", tokenMap);

  return { transformedText, tokenMap };
};

/**
 * 토큰을 원래의 고유명사로 복원하는 함수
 */
export const restoreProperNounsFromTokens = (
  text: string,
  tokenMap: { [key: string]: string }
) => {
  let restoredText = text;

  // 🔹 숫자가 큰(긴) 토큰을 먼저 변환하기 위해 내림차순 정렬
  const sortedTokens = Object.keys(tokenMap).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
    return numB - numA; // 숫자가 큰 순으로 정렬
  });

  sortedTokens.forEach((token) => {
    const regex = new RegExp(token, "g");
    restoredText = restoredText.replace(regex, tokenMap[token]);
  });

  console.log("📌 토큰이 복원된 텍스트:", restoredText);

  return restoredText;
};

/**
 * ✅ Zero Width Non-Joiner (\u200C) 삽입 함수
 */
export function addInvisibleCharacters(text: string): string {
  return text.split("").join("\u200C"); // 각 문자 사이에 ZWNJ 추가
}

/**
 * ✅ Zero Width Non-Joiner (\u200C) 제거 함수 (복구)
 */
export function removeInvisibleCharacters(text: string): string {
  return text.replace(/\u200C/g, ""); // 모든 ZWNJ 제거
}
