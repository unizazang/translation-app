import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// ✅ Web Worker 경로 설정
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// ✅ PDF 텍스트 블록 타입 정의
interface PdfTextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// ✅ 페이지 데이터 타입 정의
interface PdfPageData {
  width: number;
  height: number;
  texts: PdfTextBlock[];
}

/**
 * ✅ PDF에서 텍스트를 추출하는 함수
 */
export async function extractTextFromPdf(pdfBuffer: ArrayBuffer): Promise<PdfPageData[]> {
  const pdf = await getDocument({ data: pdfBuffer }).promise;
  console.log("✅ PDF 문서 열기 완료, 총 페이지 수:", pdf.numPages);

  const extractedData: PdfPageData[] = []; // ✅ 페이지별 데이터 저장

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 }); // ✅ 페이지 크기 정보 가져오기
    const textContent = await page.getTextContent();

    if (textContent.items.length === 0) {
      console.warn(`⚠️ 페이지 ${pageNum}에서 추출된 텍스트가 없습니다.`);
    }

    // ✅ 텍스트 블록을 추출하면서 크기(width, height) 정보도 함께 저장
    const texts: PdfTextBlock[] = textContent.items.map((item: any) => ({
      text: item.str.trim(),
      x: item.transform[4], // x 좌표
      y: viewport.height - item.transform[5], // y 좌표 (좌표계 변환)
      width: item.width || 0, // ✅ 너비 정보 추가
      height: item.height || 0, // ✅ 높이 정보 추가
    }));

    extractedData.push({
      width: viewport.width, // 페이지 너비
      height: viewport.height, // 페이지 높이
      texts, // 텍스트 블록 배열
    });
  }

  console.log("📝 정제된 PDF 데이터:", extractedData);
  return extractedData;
}
