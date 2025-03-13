import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { TranslatedTextBlock } from "./pdfLayout";
import { PdfPageData } from "./pdfProcessor";

/**
 * ✅ 번역된 텍스트를 기반으로 새로운 PDF를 생성하는 함수
 * @param translatedPages - 번역된 텍스트 블록이 포함된 PDF 페이지 데이터
 * @returns 생성된 PDF의 Uint8Array 데이터
 */
export async function generateTranslatedPdf(
  translatedPages: TranslatedTextBlock[][]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica); // ✅ 기본 폰트 설정

  for (const pageData of translatedPages) {
    const page = pdfDoc.addPage([595, 842]); // ✅ A4 크기 (px 단위)
    const { width, height } = page.getSize();

    for (const block of pageData) {
      page.drawText(block.translatedText, {
        x: block.x,
        y: height - block.y, // ✅ PDF 좌표계는 좌측 하단이 (0,0)
        size: 12, // ✅ 기본 폰트 크기
        font,
        color: rgb(0, 0, 0), // ✅ 검은색 텍스트
        maxWidth: block.width, // ✅ 원본 텍스트 블록의 너비 유지
      });
    }
  }

  return await pdfDoc.save(); // ✅ 최종 PDF 생성 후 Uint8Array 반환
}
