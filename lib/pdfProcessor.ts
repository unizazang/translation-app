import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface PdfTextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PdfPageData {
  textBlocks: PdfTextBlock[];
  width: number;
  height: number;
}

/**
 * PDF에서 텍스트와 위치 정보를 추출하는 함수
 */
export async function extractTextWithLayout(pdfBuffer: ArrayBuffer): Promise<PdfPageData[]> {
  const pdf = await getDocument({ data: pdfBuffer }).promise;
  console.log("✅ PDF 문서 열기 완료, 총 페이지 수:", pdf.numPages);

  const extractedData: PdfPageData[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();

    const textBlocks: PdfTextBlock[] = textContent.items.map((item: any) => ({
      text: item.str.trim(),
      x: item.transform[4],
      y: viewport.height - item.transform[5], // PDF 좌표계를 보정
      width: item.width,
      height: item.height,
    }));

    extractedData.push({
      textBlocks,
      width: viewport.width,
      height: viewport.height,
    });
  }

  console.log("📝 PDF 레이아웃 추출 완료:", extractedData);
  return extractedData;
}
