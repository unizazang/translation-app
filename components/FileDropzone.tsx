import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  accept: Record<string, string[]>;
  maxSize?: number;
  label?: string;
  fileType: "pdf" | "txt";
}

export default function FileDropzone({
  onFileAccepted,
  accept,
  maxSize = 57 * 1024 * 1024,
  label,
  fileType,
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];

      if (!file) return;

      if (file.size > maxSize) {
        setError(
          `파일 크기가 너무 큽니다. 최대 ${Math.round(
            maxSize / (1024 * 1024)
          )}MB까지 업로드 가능합니다.`
        );
        return;
      }

      onFileAccepted(file);
    },
    [onFileAccepted, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
  });

  const defaultLabel = {
    pdf: "PDF 파일을 이 영역에 드래그하거나 클릭하여 선택하세요",
    txt: "텍스트 파일을 이 영역에 드래그하거나 클릭하여 선택하세요",
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
      >
        <input {...getInputProps()} />
        <FontAwesomeIcon
          icon={faFileUpload}
          className="text-4xl text-gray-400 mb-4"
        />
        <p className="text-gray-600">{label || defaultLabel[fileType]}</p>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
