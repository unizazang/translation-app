/**
 * ✅ 고유명사를 토큰(__PN0__)으로 변환하는 함수
 */
export function replaceProperNounsWithTokens(
  text: string,
  properNouns: string[]
): { transformedText: string; tokenMap: Record<string, string> } {
  let transformedText = text;
  const tokenMap: Record<string, string> = {};

  properNouns.forEach((noun, index) => {
    const token = `__PN${index}__`;
    tokenMap[token] = noun;

    // ✅ 모든 경우를 포괄하는 정규식 (대소문자 구분 없음)
    const regex = new RegExp(
      `\\b${noun.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`,
      "gi"
    );

    transformedText = transformedText.replace(regex, token);
  });

  return { transformedText, tokenMap };
}

/**
 * ✅ 번역 후 토큰을 원래 고유명사로 되돌리는 함수
 */
export function restoreProperNounsFromTokens(
  translatedText: string,
  tokenMap: Record<string, string>
): string {
  let restoredText = translatedText;

  Object.entries(tokenMap).forEach(([token, original]) => {
    // ✅ 단어 경계 + 문장부호도 포함하여 변환
    const regex = new RegExp(`${token}([.,!?]*)`, "g");
    restoredText = restoredText.replace(
      regex,
      (_, punctuation) => original + (punctuation || "")
    );
  });

  return restoredText;
}

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
