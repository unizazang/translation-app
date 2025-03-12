import { PDFDocument, rgb } from "pdf-lib";

/**
 * 번역된 텍스트를 원래 좌표에 배치하여 PDF로 생성
 */
export async function createTranslatedPdf(
  originalPdfBuffer: ArrayBuffer,
  translatedTextData: { text: string; x: number; y: number; width: number; height: number }[][]
) {
  const pdfDoc = await PDFDocument.load(originalPdfBuffer);
  const pages = pdfDoc.getPages();

  translatedTextData.forEach((pageData, pageIndex) => {
    const page = pages[pageIndex];
    pageData.forEach(({ text, x, y }) => {
      page.drawText(text, {
        x,
        y,
        size: 12,
        color: rgb(0, 0, 0),
      });
    });
  });

  return pdfDoc.save();
}



export function detectColumns(
    textData: { text: string; x: number; y: number; width: number; height: number }[][],
    columnThreshold = 300
  ) {
    return textData.map((page) => {
      const columns: { [key: number]: string[] } = {};
  
      page.forEach(({ text, x }) => {
        const columnKey = Math.floor(x / columnThreshold); // ✅ x 좌표를 기준으로 단 감지
        if (!columns[columnKey]) {
          columns[columnKey] = [];
        }
        columns[columnKey].push(text);
      });
  
      return columns;
    });
  }
  