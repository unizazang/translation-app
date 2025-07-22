'use client'

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons"
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons"

interface TranslationCardProps {
  originalText: string
  translations: {
    google: string
    papago: string
    deepL: string
  }
  onSave: () => void
  onNext: () => void
  onPrevious: () => void
  isTranslating: boolean
  isStarred: boolean
  onToggleStar: () => void
  onSkip: () => void
  onTranslate?: () => void // 선택적 prop
}

const TranslationCard: React.FC<TranslationCardProps> = ({
  originalText,
  translations,
  onSave,
  onNext,
  onPrevious,
  isTranslating,
  isStarred,
  onToggleStar,
  onSkip,
  onTranslate,
}) => {
  return (
    <div className="w-full h-full flex flex-col text-black">
      {/* 원문 */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">원본 문장</h3>
          <button onClick={onToggleStar} className="text-yellow-400 hover:text-yellow-500">
            <FontAwesomeIcon
              icon={isStarred ? faStarSolid : faStarRegular}
              className="text-2xl"
            />
          </button>
        </div>
        <div className="border bg-gray-50 rounded p-4 h-[160px] overflow-y-auto text-sm">
          {originalText}
        </div>
      </div>

      {/* ✅ 번역 실행 / 이전 / 건너뛰기 / 다음 버튼 */}
      <div className="mb-6 flex justify-between">
        {/* 번역 실행 버튼 (좌측) */}
        <div>
          {onTranslate && (
            <button
              onClick={onTranslate}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              disabled={isTranslating}
            >
              {isTranslating ? '번역 중...' : '번역 실행하기'}
            </button>
          )}
        </div>

        {/* 이전/건너뛰기/다음 버튼 (우측) */}
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={isTranslating}
          >
            이전
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={isTranslating}
          >
            건너뛰기
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={isTranslating}
          >
            다음
          </button>
        </div>
      </div>

      {/* 번역 결과 */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">번역 결과</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
          {['google', 'papago', 'deepL'].map((engine) => (
            <div
              key={engine}
              className="border rounded-lg p-4 bg-white flex flex-col h-full shadow"
            >
              <strong className="text-gray-700 mb-2 text-lg">
                {engine === 'google' ? 'Google' : engine === 'papago' ? 'Papago' : 'DeepL'}
              </strong>
              <div className="flex-1 overflow-y-auto border bg-gray-50 rounded p-2 text-sm">
                {translations[engine as keyof typeof translations]}
              </div>
              <button
                className="mt-4 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                onClick={onSave}
                disabled={isTranslating}
              >
                저장하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TranslationCard
