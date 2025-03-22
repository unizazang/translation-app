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
          저장 후 자동으로 다음 문장으로 이동
        </label>
      </div>
    </div>
  );
};

export default Settings;
