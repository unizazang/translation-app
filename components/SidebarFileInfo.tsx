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
    <div className="flex flex-col px-4 py-2 text-sm bg-white">
      <div className="flex justify-between items-start">
        <span className="break-all text-gray-700 font-bold w-4/5">
          파일명: [{fileName}]
        </span>
        <button
          onClick={triggerFileInput}
          className="text-sm px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium shadow-lg  hover:bg-gray-100 transition ml-2 whitespace-nowrap cursor-pointer"
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
