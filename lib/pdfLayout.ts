import { type PdfPageData, type PdfTextBlock } from "./pdfProcessor";

export interface TranslatedTextBlock extends PdfTextBlock {
  translatedText: string;
}

/**
 * 원본 PDF 레이아웃에 번역된 텍스트를 적용하는 함수
 */
export function applyTranslationsToLayout(
  originalLayout: PdfPageData[],
  translatedTexts: string[][]
): TranslatedTextBlock[][] {
  return originalLayout.map((page, pageIndex) => {
    return page.textBlocks.map((block, blockIndex) => ({
      ...block,
      translatedText: translatedTexts[pageIndex]?.[blockIndex] || block.text,
    }));
  });
}

// ✅ `export type`을 사용하여 `isolatedModules` 옵션 대응
export type { PdfPageData, PdfTextBlock };
