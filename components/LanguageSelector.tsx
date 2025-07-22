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
    <div className="relative w-full flex justify-center items-center gap-6 text-sm font-medium">
      {/* Source Language */}
      <div className="relative w-40">
        <button
          onClick={() =>
            setOpenDropdown((prev) => (prev === 'source' ? null : 'source'))
          }
          className="w-full bg-white text-gray-900 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-500 transition"
        >
          {languages.find((l) => l.code === sourceLanguage)?.label}
        </button>
        {openDropdown === 'source' && (
          <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow z-10">
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => handleSelectLanguage('source', lang.code)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
              >
                {lang.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Arrow */}
      <div className="text-xl text-gray-500">→</div>

      {/* Target Language */}
      <div className="relative w-40">
        <button
          onClick={() =>
            setOpenDropdown((prev) => (prev === 'target' ? null : 'target'))
          }
          className="w-full bg-white text-gray-900 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-500 transition"
        >
          {languages.find((l) => l.code === targetLanguage)?.label}
        </button>
        {openDropdown === 'target' && (
          <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow z-10">
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => handleSelectLanguage('target', lang.code)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
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
