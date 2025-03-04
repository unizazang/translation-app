const STOPWORDS = new Set([
  "은",
  "는",
  "이",
  "가",
  "의",
  "을",
  "를",
  "에",
  "에서",
  "도",
  "과",
  "와",
  "있습니다",
  "없습니다",
  "였습니다",
  "되었습니다",
  "하지만",
  "그러나",
  "그러므로",
  "그리고",
  "따라서",
  "즉",
]);

const PROPER_NOUNS = new Set([
  "Amelia",
  "Bart",
  "Lankila",
  "Kelvin",
  "란킬라", // ✅ 한글 고유명사 추가
  "바트",
]);

const POSTPOSITIONS = /(의|은|는|이|가|을|를|에|에서|도|과|와)$/;

/**
 * 🔹 조사 및 종결어미 제거 함수
 */
function cleanText(text: string): string {
  let cleaned = text
    .replace(
      /(다\.|이다\.|입니다\.|있습니다\.|합니다\.|아닙니다\.|없습니다\.|되었습니다\.이며\.하며\.)$/,
      ""
    ) // 종결어미 제거
    .replace(/[^가-힣a-zA-Z0-9\s]/g, "") // 특수문자 제거
    .split(" ")
    .map((word) => word.replace(POSTPOSITIONS, "")) // ✅ 조사 제거
    .join(" ");

  return cleaned;
}

/**
 * 🔹 모든 번역문에서 공통적으로 등장하는 단어 찾기
 */
function getCommonWords(translations: string[][]): Set<string> {
  const commonWords = new Set<string>();
  const wordCounts: Record<string, number> = {};

  translations.flat().forEach((word) => {
    const cleanedWord = cleanText(word);

    if (PROPER_NOUNS.has(cleanedWord)) {
      return; // ✅ 고유명사는 제외
    }

    wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
  });

  Object.keys(wordCounts).forEach((word) => {
    if (wordCounts[word] === translations.length) {
      commonWords.add(word);
    }
  });

  return commonWords;
}

/**
 * 🔹 번역 비교 및 하이라이트 적용
 */
export function highlightDifferences(
  original: string,
  translations: string[]
): string[] {
  const cleanedTranslations = translations
    .map(cleanText)
    .map((text) => text.split(" "));

  if (new Set(translations).size === 1) {
    return translations;
  }

  const commonWords = getCommonWords(cleanedTranslations);

  return translations.map((translation) => {
    const words = translation.split(" ");
    return words
      .map((word) => {
        const cleanedWord = cleanText(word);
        return commonWords.has(cleanedWord) || PROPER_NOUNS.has(cleanedWord)
          ? word // ✅ 공통 단어 & 고유명사는 하이라이트 X
          : `<span style="background-color: #ffeeb8">${word}</span>`;
      })
      .join(" ");
  });
}
