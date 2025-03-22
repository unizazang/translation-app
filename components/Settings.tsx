"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

const Settings: React.FC = () => {
  const { autoMove, setAutoMove } = useTranslation();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">설정</h2>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoMove"
          checked={autoMove}
          onChange={(e) => setAutoMove(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="autoMove" className="text-gray-700">
          저장 후 자동으로 다음 문장 번역
        </label>
        <p className="text-gray-700">
          이 설정을 켜면 '저장하기' 버튼을 누르는 즉시 다음 문장으로 자동
          이동하고 번역이 시작됩니다. '다음 문장' 버튼을 따로 누르지 않아도
          됩니다.
        </p>
      </div>
    </div>
  );
};

export default Settings;
