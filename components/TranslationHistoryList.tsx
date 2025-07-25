// components/TranslationHistoryList.tsx
"use client";

import { useTranslationHistory } from "@/hooks/useTranslationHistory";

export default function TranslationHistoryList({
  onLoad,
}: {
  onLoad: (fileName: string, data: any[]) => void;
}) {
  const { historyList, deleteHistory } = useTranslationHistory();

  if (historyList.length === 0) {
    return <div className="text-sm text-gray-500">저장된 기록이 없습니다.</div>;
  }

  return (
    <div className="space-y-3">
      {historyList.map((item, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
        >
          <div onClick={() => onLoad(item.fileName, item.data)}>
            <div className="font-semibold">{item.fileName}</div>
            <div className="text-xs text-gray-500">{item.timestamp}</div>
            <div className="text-xs text-gray-400 mt-1">
              문장 수: {item.data.length}
            </div>
          </div>
          <button
            onClick={() => deleteHistory(item.key)}
            className="text-red-500 text-sm hover:underline"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
