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
    <div className="relative w-full flex justify-center items-center gap-8 text-base font-semibold text-gray-900">
      {/* Source Language */}
      <div className="relative w-44">
        <button
          onClick={() =>
            setOpenDropdown((prev) => (prev === 'source' ? null : 'source'))
          }
          className={
            `w-full bg-white text-gray-900 px-5 py-2 border border-gray-200 rounded-xl shadow-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150 flex items-center justify-between ${openDropdown === 'source' ? 'ring-2 ring-blue-300' : ''}`
          }
        >
          <span className="truncate">{languages.find((l) => l.code === sourceLanguage)?.label}</span>
          <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {openDropdown === 'source' && (
          <ul className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-fadeIn">
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => handleSelectLanguage('source', lang.code)}
                className={`px-5 py-2 hover:bg-blue-50 cursor-pointer transition-all duration-100 ${sourceLanguage === lang.code ? 'bg-blue-100 text-blue-600 font-bold' : ''}`}
              >
                {lang.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Arrow */}
      <div className="text-2xl text-gray-400 select-none">→</div>

      {/* Target Language */}
      <div className="relative w-44">
        <button
          onClick={() =>
            setOpenDropdown((prev) => (prev === 'target' ? null : 'target'))
          }
          className={
            `w-full bg-white text-gray-900 px-5 py-2 border border-gray-200 rounded-xl shadow-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150 flex items-center justify-between ${openDropdown === 'target' ? 'ring-2 ring-blue-300' : ''}`
          }
        >
          <span className="truncate">{languages.find((l) => l.code === targetLanguage)?.label}</span>
          <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {openDropdown === 'target' && (
          <ul className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-fadeIn">
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => handleSelectLanguage('target', lang.code)}
                className={`px-5 py-2 hover:bg-blue-50 cursor-pointer transition-all duration-100 ${targetLanguage === lang.code ? 'bg-blue-100 text-blue-600 font-bold' : ''}`}
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
