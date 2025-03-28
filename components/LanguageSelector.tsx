"use client";

import { useState } from "react";

interface LanguageSelectorProps {
  onSelectLanguage: (language: string) => void;
}

export default function LanguageSelector({
  onSelectLanguage,
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    onSelectLanguage(language);
  };

  return (
    <div className="text-black">
      <label htmlFor="language" className=" text-black">
        번역을 시작할 언어:{" "}
      </label>
      <select
        className="text-black"
        id="language"
        value={selectedLanguage}
        onChange={handleChange}
      >
        <option value="en">영어</option>
        <option value="zh">중국어</option>
        <option value="ja">일본어</option>
      </select>
      <p className="text-gray-500">번역된 결과는 한국어로 제공됩니다.</p>
    </div>
  );
}
