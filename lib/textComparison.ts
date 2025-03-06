/**
 * 🔹 모든 번역문에서 공통적으로 등장하는 단어 찾기
 */
function getCommonWords(translations: string[][]): Set<string> {
  const commonWords = new Set<string>();
  const wordCounts: Record<string, number> = {};

  translations.flat().forEach((word) => {
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
// export function highlightDifferences(
//   original: string,
//   translations: string[]
// ): string[] {
//   const commonWords = getCommonWords(translations.map((text) => text.split(" ")));

//   return translations.map((translation) => {
//     return translation
//       .split(" ")
//       .map((word) =>
//         commonWords.has(word)
//           ? word
//           : `<span style="background-color: #ffeeb8">${word}</span>`
//       )
//       .join(" ");
//   });
// }
