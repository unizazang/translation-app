export interface TranslatedTextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 번역된 텍스트를 원래 레이아웃에 적용하는 함수
 */
export function applyTranslationsToLayout(
  layoutData: TranslatedTextBlock[],
  translatedTexts: string[]
): TranslatedTextBlock[] {
  return layoutData.map((block: TranslatedTextBlock, blockIndex: number) => ({
    ...block,
    text: translatedTexts[blockIndex] || block.text,
  }));
}
