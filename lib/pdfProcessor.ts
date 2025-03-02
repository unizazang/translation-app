import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// ✅ Web Worker 경로를 고정된 버전으로 직접 설정
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

/**
 * PDF 파일을 로드하는 함수
 */
export async function loadPdf(file: File) {
  const reader = new FileReader();
  return new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * PDF에서 텍스트를 추출하는 함수
 */
export async function extractTextFromPdf(pdfBuffer: ArrayBuffer) {
  const pdf = await getDocument({ data: pdfBuffer }).promise;
  console.log("✅ PDF 문서 열기 완료, 총 페이지 수:", pdf.numPages);
  const extractedText: { text: string; x: number; y: number }[][] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    if (textContent.items.length === 0) {
      console.warn(`⚠️ 페이지 ${pageNum}에서 추출된 텍스트가 없습니다.`);
    }

    const lines = textContent.items.map((item: any) => ({
      text: item.str,
      x: item.transform[4], // x 좌표
      y: item.transform[5], // y 좌표
    }));

    extractedText.push(lines);
  }

  return extractedText;
}

/**
 * x 좌표 기준으로 컬럼을 자동 분리하는 함수
 */
export function splitTextByColumns(
  textData: { text: string; x: number; y: number }[][],
  columnThreshold = 300
) {
  return textData.map((page) => {
    const leftColumn: string[] = [];
    const rightColumn: string[] = [];

    page.forEach(({ text, x }) => {
      if (x < columnThreshold) {
        leftColumn.push(text);
      } else {
        rightColumn.push(text);
      }
    });

    return {
      leftColumn: leftColumn.join(" "),
      rightColumn: rightColumn.join(" "),
    };
  });
}

/**
 * 텍스트를 문장 단위로 나누는 함수
 */
export function splitTextIntoSentences(text: string): string[] {
  return text.replace(/\n+/g, " ").match(/[^.!?]+[.!?]+|.+$/g) || [];
}

/**
 * 컬럼별 문장을 나누는 함수
 */
export function splitColumnsIntoSentences(columnText: {
  leftColumn: string;
  rightColumn: string;
}) {
  return {
    leftSentences: splitTextIntoSentences(columnText.leftColumn),
    rightSentences: splitTextIntoSentences(columnText.rightColumn),
  };
}
