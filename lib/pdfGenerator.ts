import { PDFDocument, rgb } from "pdf-lib";
import { PdfPageData } from "./pdfProcessor";

/**
 * ✅ 번역된 데이터를 기반으로 새로운 PDF 생성
 */
export async function generateTranslatedPdf(
  originalPdfBytes: ArrayBuffer,
  translatedTextData: PdfPageData[]
): Promise<Uint8Array> {
  // ✅ 원본 PDF 로드
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const font = await pdfDoc.embedFont(PDFDocument.PDFFont.Helvetica);

  // ✅ 페이지별 번역 텍스트 적용
  translatedTextData.forEach((pageData, pageIndex) => {
    const page = pdfDoc.getPages()[pageIndex];
    const { width, height } = page.getSize();

    pageData.textBlocks.forEach((block) => {
      page.drawText(block.text, {
        x: block.x,
        y: height - block.y, // ✅ PDF 좌표계 변환 (좌측 하단 기준)
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    });
  });

  return await pdfDoc.save();
}
