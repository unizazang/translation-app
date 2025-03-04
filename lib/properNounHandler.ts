/**
 * ✅ 고유명사를 토큰(__PN0__)으로 변환하는 함수
 */
export function replaceProperNounsWithTokens(
  text: string,
  properNouns: string[]
): { transformedText: string; tokenMap: Record<string, string> } {
  let transformedText = text;
  const tokenMap: Record<string, string> = {}; // 토큰과 원래 단어 매핑 저장

  properNouns.forEach((noun, index) => {
    const token = `__PN${index}__`; // 고유 토큰 생성
    tokenMap[token] = noun; // 원래 단어 저장
    const regex = new RegExp(`\\b${noun}\\b`, "gi"); // 단어 단위로 정확히 매칭
    transformedText = transformedText.replace(regex, token); // 변환 적용
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
    const regex = new RegExp(token, "g");
    restoredText = restoredText.replace(regex, original); // 토큰을 원래 단어로 변경
  });

  return restoredText;
}
