'use client'

import { useState } from 'react'

interface LanguageSelectorProps {
  onSelectSourceLanguage: (language: string) => void
  onSelectTargetLanguage: (language: string) => void
}

const languages = [
  { code: 'en', label: '영어' },
  { code: 'zh', label: '중국어' },
  { code: 'ja', label: '일본어' },
  { code: 'ko', label: '한국어' },
]

export default function LanguageSelector({
  onSelectSourceLanguage,
  onSelectTargetLanguage,
}: LanguageSelectorProps) {
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('ko')
  const [openDropdown, setOpenDropdown] = useState<'source' | 'target' | null>(null)

  const handleSelectLanguage = (type: 'source' | 'target', code: string) => {
    if (type === 'source') {
      setSourceLanguage(code)
      onSelectSourceLanguage(code)
    } else {
      setTargetLanguage(code)
      onSelectTargetLanguage(code)
    }
    setOpenDropdown(null)
  }

  return (
    <div className="relative w-full flex justify-center items-center gap-6">
      {/* Source Language */}
      <div className="relative">
        <button
          onClick={() =>
            setOpenDropdown((prev) => (prev === 'source' ? null : 'source'))
          }
          className="bg-pink-200 text-black px-6 py-3 rounded-t-md text-lg font-bold w-40"
        >
          {languages.find((l) => l.code === sourceLanguage)?.label} ▼
        </button>
        {openDropdown === 'source' && (
          <ul className="absolute top-full left-0 w-full bg-pink-100 border border-pink-300 z-10 rounded-b-md text-black">
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => handleSelectLanguage('source', lang.code)}
                className="px-4 py-2 cursor-pointer hover:bg-pink-300"
              >
                {lang.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Arrow */}
      <div className="text-2xl font-bold text-gray-700">→</div>

      {/* Target Language */}
      <div className="relative">
        <button
          onClick={() =>
            setOpenDropdown((prev) => (prev === 'target' ? null : 'target'))
          }
          className="bg-pink-200 text-black px-6 py-3 rounded-t-md text-lg font-bold w-40"
        >
          {languages.find((l) => l.code === targetLanguage)?.label} ▼
        </button>
        {openDropdown === 'target' && (
          <ul className="absolute top-full left-0 w-full bg-pink-100 border border-pink-300 z-10 rounded-b-md text-black">
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => handleSelectLanguage('target', lang.code)}
                className="px-4 py-2 cursor-pointer hover:bg-pink-300"
              >
                {lang.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
