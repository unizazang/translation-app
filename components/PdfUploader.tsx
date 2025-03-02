"use client";

import { useState } from "react";
import {
  loadPdf,
  extractTextFromPdf,
  splitTextByColumns,
} from "@/lib/pdfProcessor";
import { usePdf } from "@/hooks/usePdf";

export default function PdfUploader() {
  const { setPdfText, columnThreshold } = usePdf();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const pdfBuffer = await loadPdf(file);
    const extractedText = await extractTextFromPdf(pdfBuffer);
    const columnText = splitTextByColumns(extractedText, columnThreshold);

    setPdfText(columnText); // 추출된 텍스트 저장
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onChange={handleFileUpload}
      />
      {fileName && <p>파일명: {fileName}</p>}
    </div>
  );
}
