"use client";

import { useState } from "react";
import { loadPdf, extractTextFromPdf, PdfPageData } from "@/lib/pdfProcessor";
import FileDropzone from "./FileDropzone";
import { motion, AnimatePresence } from "framer-motion";

interface PdfUploaderProps {
  onTextExtracted: (text: PdfPageData[][]) => void;
}

export default function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * ✅ PDF 업로드 및 텍스트 추출 핸들러
   */
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const pdfBuffer: ArrayBuffer = await loadPdf(file);
      const extractedText: PdfPageData[][] = await extractTextFromPdf(
        pdfBuffer
      );
      onTextExtracted(extractedText);
    } catch (error) {
      console.error("❌ PDF 처리 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 border rounded-lg bg-gray-50"
    >
      <h2 className="text-xl font-semibold mb-4">
        PDF를 올리고 지금 바로 시작해보세요!
      </h2>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center p-8"
          >
            <motion.div
              className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="mt-4 text-gray-600"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              PDF 파일 처리중...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FileDropzone
              onFileAccepted={handleFileUpload}
              accept={{
                "application/pdf": [".pdf"],
              }}
              fileType="pdf"
              maxSize={57 * 1024 * 1024}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
