import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// ✅ Web Worker 경로를 설정
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

/**
 * PDF 파일을 로드하는 함수
 */
export async function loadPdf(file: File): Promise<ArrayBuffer> {
  const reader = new FileReader();
  return new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * ✅ 이상한 공백이랑 특수문자 치환하는 함수
 */
export function cleanExtractedText(text: string): string {
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "") // ✅ 제어 문자 및 비표준 문자 제거
    .replace(/\s{2,}/g, " ") // 연속된 공백을 하나로 줄임
    .replace(/-\s+/g, "") // 하이픈 뒤에 공백이 있으면 붙여서 연결
    .replace(/([a-zA-Z]) (?=[a-zA-Z])/g, "$1 ") // ✅ 단어 사이 띄어쓰기 유지
    .replace(/’/g, "'") // 이상한 특수문자 치환
    .trim();
}

/**
 * ✅ PDF 텍스트 및 레이아웃 정보 타입 정의
 */
export interface PdfTextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PdfPageData {
  pageNumber: number;
  textBlocks: PdfTextBlock[];
}

/**
 * ✅ PDF에서 텍스트를 추출하는 함수 (좌표 정보 포함)
 */
export async function extractTextFromPdf(pdfBuffer: ArrayBuffer): Promise<PdfPageData[]> {
  const pdf = await getDocument({ data: pdfBuffer }).promise;
  console.log("✅ PDF 문서 열기 완료, 총 페이지 수:", pdf.numPages);

  const extractedText: PdfPageData[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    if (textContent.items.length === 0) {
      console.warn(`⚠️ 페이지 ${pageNum}에서 추출된 텍스트가 없습니다.`);
    }

    // ✅ 텍스트 블록 단위로 좌표 정보 유지
    const textBlocks: PdfTextBlock[] = textContent.items.map((item: any) => ({
      text: cleanExtractedText(item.str),
      x: item.transform[4], // x 좌표
      y: item.transform[5], // y 좌표
      width: item.width || 0, // ✅ 블록 너비 추가
      height: item.height || 0, // ✅ 블록 높이 추가
    }));

    extractedText.push({ pageNumber: pageNum, textBlocks });
  }

  console.log("📝 정제된 PDF 텍스트 및 위치 정보:", extractedText);
  return extractedText;
}

/**
 * ✅ 여러 단(column)으로 된 페이지를 자동으로 감지하여 분리하는 함수
 */
export function splitTextByColumns(
  textData: PdfPageData[],
  columnThreshold = 300
): { pageNumber: number; columns: { [key: number]: PdfTextBlock[] } }[] {
  return textData.map((page) => {
    const columns: { [key: number]: PdfTextBlock[] } = {};

    page.textBlocks.forEach((block) => {
      const columnKey = Math.floor(block.x / columnThreshold); // ✅ x 좌표를 기준으로 단 감지
      if (!columns[columnKey]) {
        columns[columnKey] = [];
      }
      columns[columnKey].push(block);
    });

    return { pageNumber: page.pageNumber, columns };
  });
}
