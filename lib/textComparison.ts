const STOPWORDS = new Set([
  // 한국어 조사 및 접속사
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
  "란킬라",
  "바트", // ✅ 한글 고유명사 추가
]);

// ✅ 일본어 및 중국어의 조사 & 접속사 추가
const STOPWORDS_JA = new Set([
  "の",
  "が",
  "は",
  "に",
  "を",
  "と",
  "も",
  "で",
  "から",
  "より",
  "そして",
  "しかし",
  "だから",
  "しかしながら",
  "また",
  "ならびに",
]);

const STOPWORDS_ZH = new Set([
  "的",
  "了",
  "和",
  "但",
  "或者",
  "而",
  "那么",
  "所以",
  "然后",
  "因为",
]);

const POSTPOSITIONS = /(의|은|는|이|가|을|를|에|에서|도|과|와)$/;

/**
 * 🔹 조사 및 불필요한 단어 제거 함수 (한국어 + 일본어 + 중국어)
 */
function cleanText(
  text: string,
  language: "ko" | "ja" | "zh" | "other"
): string {
  let cleaned = text
    .replace(
      /(다\.|이다\.|입니다\.|있습니다\.|합니다\.|아닙니다\.|없습니다\.|되었습니다\.이며\.하며\.)$/,
      ""
    ) // 종결어미 제거
    .replace(/[^가-힣a-zA-Z0-9一-龯ぁ-ゔァ-ヴー々〆〤\s]/g, "") // 특수문자 제거 (일본어 & 중국어 포함)
    .split(" ")
    .map((word) => {
      if (language === "ko") return word.replace(POSTPOSITIONS, ""); // ✅ 한국어 조사 제거
      if (language === "ja" && STOPWORDS_JA.has(word)) return ""; // ✅ 일본어 조사 제거
      if (language === "zh" && STOPWORDS_ZH.has(word)) return ""; // ✅ 중국어 조사 제거
      return word;
    })
    .filter(Boolean) // 빈 문자열 제거
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
    if (PROPER_NOUNS.has(word)) return; // ✅ 고유명사는 제외
    wordCounts[word] = (wordCounts[word] || 0) + 1;
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
  translations: string[],
  language: "ko" | "ja" | "zh"
): string[] {
  const cleanedTranslations = translations
    .map((text) => cleanText(text, language))
    .map((text) => text.split(" "));

  if (new Set(translations).size === 1) {
    return translations;
  }

  const commonWords = getCommonWords(cleanedTranslations);

  return translations.map((translation) => {
    const words = translation.split(" ");
    return words
      .map((word) => {
        const cleanedWord = cleanText(word, language);
        return commonWords.has(cleanedWord) || PROPER_NOUNS.has(cleanedWord)
          ? word // ✅ 공통 단어 & 고유명사는 하이라이트 X
          : `<span style="background-color: #ffeeb8">${word}</span>`;
      })
      .join(" ");
  });
}
