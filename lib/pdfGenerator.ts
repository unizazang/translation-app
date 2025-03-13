import { PDFDocument } from "pdf-lib";
import { TranslatedTextBlock } from "./pdfLayout";

/**
 * 번역된 텍스트를 기반으로 새로운 PDF를 생성하는 함수
 */
export async function generateTranslatedPdf(translatedPages: TranslatedTextBlock[][]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  for (const pageBlocks of translatedPages) {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    pageBlocks.forEach((block) => {
      page.drawText(block.translatedText, {
        x: block.x,
        y: height - block.y,
        size: 12,
      });
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
