import { useState } from "react";

export function usePdf() {
  const [pdfText, setPdfText] = useState<
    { leftColumn: string; rightColumn: string }[]
  >([]);
  const [columnThreshold, setColumnThreshold] = useState(300); // 기본 컬럼 기준값

  return {
    pdfText,
    setPdfText,
    columnThreshold,
    setColumnThreshold,
  };
}
