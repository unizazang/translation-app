"use client";

import { useState } from "react";

interface LanguageSelectorProps {
  onSelectSourceLanguage: (language: string) => void;
  onSelectTargetLanguage: (language: string) => void;
}

export default function LanguageSelector({
  onSelectSourceLanguage,
  onSelectTargetLanguage,
}: LanguageSelectorProps) {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("ko");

  const handleSourceLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSourceLanguage(language);
    onSelectSourceLanguage(language);
  };

  const handleTargetLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setTargetLanguage(language);
    onSelectTargetLanguage(language);
  };

  return (
    <div className="flex flex-col gap-4 text-black">
      <div>
        <label htmlFor="sourceLanguage" className="text-black">
          번역을 시작할 언어:{" "}
        </label>
        <select
          className="text-black"
          id="sourceLanguage"
          value={sourceLanguage}
          onChange={handleSourceLanguageChange}
        >
          <option value="en">영어</option>
          <option value="zh">중국어</option>
          <option value="ja">일본어</option>
          <option value="ko">한국어</option>
        </select>
      </div>
      <div>
        <label htmlFor="targetLanguage" className="text-black">
          번역 완료 언어:{" "}
        </label>
        <select
          className="text-black"
          id="targetLanguage"
          value={targetLanguage}
          onChange={handleTargetLanguageChange}
        >
          <option value="ko">한국어</option>
          <option value="en">영어</option>
        </select>
      </div>
    </div>
  );
}
