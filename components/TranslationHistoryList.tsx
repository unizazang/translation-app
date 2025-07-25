"use client";

import { useEffect, useState } from "react";
import { getUserHistories } from "@/lib/supabase/translation";
import { supabase } from "@/lib/supabase-browser";

type History = {
  id: string;
  file_name: string;
  file_hash: string;
  created_at: string;
};

interface Props {
  onSelect: (fileHash: string, fileName: string) => void;
}

export default function TranslationHistoryList({ onSelect }: Props) {
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistories = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const list = await getUserHistories(user.id);
      setHistories(list);
      setLoading(false);
    };

    fetchHistories();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-500">히스토리를 불러오는 중...</div>
    );
  }

  if (histories.length === 0) {
    return (
      <div className="text-sm text-gray-500">저장된 번역 기록이 없습니다.</div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">📂 번역 기록</h2>
      <ul className="space-y-1">
        {histories.map((item) => (
          <li
            key={item.id}
            className="cursor-pointer hover:underline text-blue-600"
            onClick={() => onSelect(item.file_hash, item.file_name)}
          >
            {item.file_name} ({new Date(item.created_at).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
