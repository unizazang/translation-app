import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// ✅ Web Worker 경로 설정
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;


export interface PdfTextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}


/**
 * PDF 페이지의 텍스트 블록 데이터 타입 정의
 */
export interface PdfPageData {
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  textBlocks: PdfTextBlock[]; // ✅ textBlocks 속성 추가 (배열 타입)
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

/* 
일반 공백, 탭, 개행,

모든 유니코드 invisible character,

zero-width space, non-breaking space 등
최대한 모든 "비가시 문자"를 날리는 쿼리입니다.
UPDATE callteam_roles
SET email = REGEXP_REPLACE(
  email,
  '[\s\u00a0\u200b\u200e\u200f\u2028\u2029\u202a\u202b\u202c\u202d\u202e\u2060\u3000]+',
  '',
  'g'
)
WHERE email LIKE 'zifnffk32123%';

*/


/**
 * ✅ PDF에서 텍스트를 추출하는 함수
 */
export async function extractTextFromPdf(pdfBuffer: ArrayBuffer): Promise<PdfPageData[][]> {
  const pdf = await getDocument({ data: pdfBuffer }).promise;
  console.log("✅ PDF 문서 열기 완료, 총 페이지 수:", pdf.numPages);

  const extractedText: PdfPageData[][] = []; // ✅ 좌표 정보 유지

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();

    if (textContent.items.length === 0) {
      console.warn(`⚠️ 페이지 ${pageNum}에서 추출된 텍스트가 없습니다.`);
    }

    const lines: PdfTextBlock[] = textContent.items.map((item: any) => ({
      text: cleanExtractedText(item.str), // ✅ 텍스트 정제
      x: item.transform[4], // x 좌표
      y: viewport.height - item.transform[5], // ✅ PDF 좌표계 변환 (위치 보정)
      width: item.width || 0, // ✅ 기본값 0 설정
      height: item.height || 0,
    }));

    // ✅ PdfPageData 타입을 올바르게 생성하여 추가
    extractedText.push([
      {
        text: lines.map(block => block.text).join(" "), // 페이지 전체 텍스트 합치기
        x: 0, // 기본값 설정 (필요한 경우 좌표값 계산 가능)
        y: 0,
        width: viewport.width,
        height: viewport.height,
        textBlocks: lines, // 추출된 텍스트 블록 배열 추가
      },
    ]);
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
      text: textBlocks.map(block => block.text).join(" "), // 페이지 전체 텍스트 합치기
      x: 0, // 기본값 설정 (필요한 경우 좌표값 계산 가능)
      y: 0,
      width: viewport.width,
      height: viewport.height,
      textBlocks,
    });
  }

  console.log("📝 PDF 레이아웃 추출 완료:", extractedData);
  return extractedData;
}
