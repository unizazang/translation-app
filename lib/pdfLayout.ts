import { PdfPageData, PdfTextBlock } from "./pdfProcessor"; // ✅ 기존 타입 활용

// ✅ 번역된 텍스트를 원본 레이아웃에 배치하는 타입 정의
interface TranslatedTextBlock extends PdfTextBlock {
  translatedText: string;
}

/**
 * ✅ 번역된 텍스트를 원본 위치에 배치하는 함수
 * @param originalPages - 원본 PDF의 텍스트 데이터
 * @param translatedTexts - 번역된 문장 배열 (페이지별 배열)
 * @returns 번역된 텍스트가 배치된 PDF 페이지 데이터
 */
export function applyTranslationsToLayout(
  originalPages: PdfPageData[],
  translatedTexts: string[][]
): TranslatedTextBlock[][] {
  return originalPages.map((page, pageIndex) => {
    return page.texts.map((block, blockIndex) => ({
      ...block,
      translatedText: translatedTexts[pageIndex]?.[blockIndex] || "", // ✅ 번역된 텍스트 매핑
    }));
  });
}
