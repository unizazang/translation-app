'use client'

import { useState } from "react"

interface LanguageSelectorProps {
  onSelectSourceLanguage: (language: string) => void
  onSelectTargetLanguage: (language: string) => void
}

export default function LanguageSelector({
  onSelectSourceLanguage,
  onSelectTargetLanguage,
}: LanguageSelectorProps) {
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("ko")

  const handleSourceLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value
    setSourceLanguage(language)
    onSelectSourceLanguage(language)
  }

  const handleTargetLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value
    setTargetLanguage(language)
    onSelectTargetLanguage(language)
  }

  return (
    <div className="flex justify-between items-start gap-8 w-full text-black">
      {/* 왼쪽: 시작 언어 */}
      <div className="flex flex-col">
        <label htmlFor="sourceLanguage" className="mb-1 font-semibold text-sm">
          번역을 시작할 언어
        </label>
        <select
          id="sourceLanguage"
          value={sourceLanguage}
          onChange={handleSourceLanguageChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
        >
          <option value="en">영어</option>
          <option value="zh">중국어</option>
          <option value="ja">일본어</option>
          <option value="ko">한국어</option>
        </select>
      </div>

      {/* 오른쪽: 번역 결과 언어 */}
      <div className="flex flex-col">
        <label htmlFor="targetLanguage" className="mb-1 font-semibold text-sm">
          번역 완료 언어
        </label>
        <select
          id="targetLanguage"
          value={targetLanguage}
          onChange={handleTargetLanguageChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
        >
          <option value="ko">한국어</option>
          <option value="en">영어</option>
        </select>
      </div>
    </div>
  )
}
