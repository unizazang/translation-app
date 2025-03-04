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

/*
 * 이상한 공백이랑 특수문자 치환하는 함수
 */

export function cleanExtractedText(text: string): string {
  return text
    .replace(/\s{2,}/g, " ") // 연속된 공백을 하나로 줄임
    .replace(/-\s+/g, "") // 하이픈 뒤에 공백이 있으면 붙여서 연결
    .replace(/([a-zA-Z])\s+([a-zA-Z])/g, "$1$2") // 중간에 들어간 공백 제거 (단어 사이)
    .replace(/’/g, "'") // 이상한 특수문자 치환
    .trim();
}

/**
 * PDF에서 텍스트를 추출하는 함수
 */
export async function extractTextFromPdf(pdfBuffer: ArrayBuffer) {
  const pdf = await getDocument({ data: pdfBuffer }).promise;
  console.log("✅ PDF 문서 열기 완료, 총 페이지 수:", pdf.numPages);

  let extractedText: string = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    if (textContent.items.length === 0) {
      console.warn(`⚠️ 페이지 ${pageNum}에서 추출된 텍스트가 없습니다.`);
    }

    const pageText = textContent.items.map((item: any) => item.str).join(" "); // 텍스트를 하나의 문자열로 합치기

    extractedText += " " + pageText; // 페이지별 텍스트를 하나로 결합
  }

  extractedText = cleanExtractedText(extractedText); // ✅ 불필요한 공백 및 특수문자 제거
  console.log("📝 정제된 PDF 텍스트:", extractedText);

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
