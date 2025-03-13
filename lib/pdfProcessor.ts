import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// ✅ Web Worker 경로 설정
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

/**
 * PDF 페이지의 텍스트 블록 데이터 타입 정의
 */
export interface PdfPageData {
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

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
 * ✅ PDF에서 텍스트를 추출하는 함수
 */
export async function extractTextFromPdf(pdfBuffer: ArrayBuffer): Promise<PdfPageData[][]> {
  const pdf = await getDocument({ data: pdfBuffer }).promise();
  console.log("✅ PDF 문서 열기 완료, 총 페이지 수:", pdf.numPages);

  const extractedText: PdfPageData[][] = []; // ✅ 좌표 정보 유지

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    if (textContent.items.length === 0) {
      console.warn(`⚠️ 페이지 ${pageNum}에서 추출된 텍스트가 없습니다.`);
    }

    const lines = textContent.items.map((item: any) => ({
      text: cleanExtractedText(item.str), // ✅ 텍스트 정제
      x: item.transform[4], // x 좌표
      y: item.transform[5], // y 좌표
      width: item.width || 0, // ✅ 기본값 0 설정
      height: item.height || 0,
    }));

    extractedText.push(lines);
  }

  console.log("📝 정제된 PDF 텍스트:", extractedText);
  return extractedText;
}

/**
 * ✅ x 좌표 기준으로 컬럼을 자동 분리하는 함수
 */
export function splitTextByColumns(
  textData: PdfPageData[][],
  columnThreshold = 300
) {
  return textData.map((page) => {
    const leftColumn: string[] = [];
    const rightColumn: string[] = [];

    page.forEach(({ text, x }) => {
      const cleanedText = cleanExtractedText(text); // ✅ 컬럼별 텍스트 정제 적용
      if (x < columnThreshold) {
        leftColumn.push(cleanedText);
      } else {
        rightColumn.push(cleanedText);
      }
    });

    return {
      leftColumn: leftColumn.join(" "),
      rightColumn: rightColumn.join(" "),
    };
  });
}
