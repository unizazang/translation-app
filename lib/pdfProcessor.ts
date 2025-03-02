import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import dynamic from "next/dynamic";

// pdfjs-dist의 Web Worker를 동적으로 로드
const pdfjsLib = dynamic(() => import("pdfjs-dist/build/pdf"), { ssr: false });

export async function loadPdf(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  return pdf;
}

/**
 * PDF 문서에서 텍스트를 추출하는 함수
 * @param pdfBuffer PDF 파일의 ArrayBuffer
 * @returns 각 페이지별 텍스트 배열
 */
export async function extractTextFromPdf(pdfBuffer: ArrayBuffer) {
  const pdf = await getDocument({ data: pdfBuffer }).promise;
  const extractedText: string[][] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // 텍스트를 x 좌표 기준으로 정렬하여 컬럼을 분리
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
 * 텍스트를 x 좌표 기준으로 컬럼을 분리하는 함수
 * @param textData 각 페이지별 텍스트 데이터 (x, y 좌표 포함)
 * @param columnThreshold 컬럼을 나누는 x 좌표 기준값 (예: 300px)
 * @returns 컬럼별 텍스트 배열
 */
export function splitTextByColumns(
  textData: { text: string; x: number; y: number }[][],
  columnThreshold = 300
) {
  return textData.map((page) => {
    // 왼쪽 컬럼과 오른쪽 컬럼을 구분
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
      leftColumn: leftColumn.join(" "), // 왼쪽 컬럼 텍스트 합치기
      rightColumn: rightColumn.join(" "), // 오른쪽 컬럼 텍스트 합치기
    };
  });
}
