"use client";

import { useState, useEffect } from "react";
import {
  loadPdf,
  extractTextFromPdf,
  splitTextByColumns,
} from "@/lib/pdfProcessor";
import { usePdf } from "@/hooks/usePdf";

// ✅ Props 타입 정의
interface PdfUploaderProps {
  onTextExtracted: (text: string) => void;
}

export default function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const { setPdfText, columnThreshold } = usePdf();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // ✅ 클라이언트 여부 체크

  // ✅ 클라이언트 환경에서만 렌더링
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // ✅ 서버에서는 아무것도 렌더링하지 않음

  // ✅ 파일 업로드 핸들러
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      console.log("📌 PDF 업로드 시작:", file.name);

      // ✅ PDF 로드 & 텍스트 추출
      const pdfBuffer = await loadPdf(file);
      console.log("✅ PDF 로드 완료, 크기:", pdfBuffer.byteLength);

      const extractedText = await extractTextFromPdf(pdfBuffer);
      console.log("✅ 텍스트 추출 완료:", extractedText);

      // ✅ 칼럼 단위로 텍스트 나누기
      const columnText = splitTextByColumns(extractedText, columnThreshold);
      console.log("📌 Extracted Text:", columnText);

      setPdfText(columnText);

      // ✅ 부모 컴포넌트로 텍스트 전달
      onTextExtracted(columnText.join("\n"));
    } catch (error) {
      console.error("❌ 오류 발생:", error);
    }
  };

  return (
    <div>
      <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
        PDF 업로드
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
      {fileName && <p>파일명: {fileName}</p>}
    </div>
  );
}
