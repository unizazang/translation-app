'use client';

import { useRef } from 'react';

interface SidebarFileInfoProps {
  fileName: string;
  onReplaceFile: (file: File) => void;
}

export default function SidebarFileInfo({
  fileName,
  onReplaceFile,
}: SidebarFileInfoProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onReplaceFile(file);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 text-sm bg-white">
      <span className="truncate text-gray-700 font-medium">
        파일명: [{fileName}]
      </span>
      <div>
        <button
          onClick={triggerFileInput}
          className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
        >
          파일 교체
        </button>
        <input
          type="file"
          accept="application/pdf"
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
