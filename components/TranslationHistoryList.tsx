"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/auth/client";
import { getTranslationHistories } from "@/lib/supabase/translation";

interface HistoryItem {
  file_hash: string;
  file_name: string;
  created_at: string | null; // ← 여기만 수정
}

interface Props {
  onSelect: (fileHash: string, fileName: string) => void;
}

export default function TranslationHistoryList({ onSelect }: Props) {
  const user = useUser();
  const [histories, setHistories] = useState<HistoryItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHistories = async () => {
      setLoading(true);
      const result = await getTranslationHistories(user.id);

      if (!result || result.length === 0) {
        console.log("📂 번역 히스토리가 없습니다.");
      }

      setHistories(result ?? []);
      setLoading(false);
    };

    fetchHistories();
  }, [user]);

  if (!user) {
    return (
      <p className="text-sm text-red-500 text-center">
        로그인한 사용자만 히스토리를 조회할 수 있습니다.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-gray-400 text-center">
        히스토리를 불러오는 중입니다...
      </p>
    );
  }

  if (histories && histories.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center">
        아직 저장된 번역 히스토리가 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {histories?.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(item.file_hash, item.file_name)}
          className="..."
        >
          <div className="text-sm font-medium">{item.file_name}</div>
          <div className="text-xs text-gray-400">
            저장일시:{" "}
            {item.created_at
              ? new Date(item.created_at).toLocaleString()
              : "날짜 없음"}
          </div>
        </button>
      ))}
    </div>
  );
}
