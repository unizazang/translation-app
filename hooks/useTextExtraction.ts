import { useState } from "react";
import { extractTextFromPdf } from "@/lib/pdfProcessor";

export function useTextExtraction() {
  const [extractedText, setExtractedText] = useState<string>("");

  const extractText = async (file: File) => {
    const text = await extractTextFromPdf(file);
    setExtractedText(text);
  };

  return { extractedText, extractText };
}
