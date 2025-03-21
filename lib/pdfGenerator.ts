import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { TranslatedTextBlock } from "./pdfLayout";

/**
 * 번역된 텍스트를 기반으로 새로운 PDF를 생성하는 함수
 */
export async function generateTranslatedPdf(
  translatedPages: TranslatedTextBlock[][]
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  // 한글 지원을 위한 폰트 설정
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const pageBlocks of translatedPages) {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    pageBlocks.forEach((block) => {
      // 텍스트를 이미지로 변환하여 그리기
      const text = block.translatedText;
      const fontSize = 12;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      page.drawText(text, {
        x: block.x,
        y: height - block.y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
