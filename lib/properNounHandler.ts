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
    // 토큰 형식을 변경하여 단어로 인식되지 않도록 함
    // Proper _ Noun _ index
    const token = `**P_N_${index}**`;
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

  Object.keys(tokenMap).forEach((token) => {
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
