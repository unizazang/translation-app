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
  onSave: (engine: 'google' | 'deepL') => void
  onNext: () => void
  onPrevious: () => void
  isTranslating: boolean
  isStarred: boolean
  onToggleStar: () => void
  onSkip: () => void
  onTranslate?: () => void
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
    <div className="w-full h-full flex flex-col text-gray-900 font-medium bg-white rounded-2xl p-6 border border-gray-100">
      {/* 원문 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
            원본 문장
          </h3>
          <button
            onClick={onToggleStar}
            className="text-yellow-400 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 rounded-full p-1 transition-all duration-150"
            aria-label="즐겨찾기"
          >
            <FontAwesomeIcon
              icon={isStarred ? faStarSolid : faStarRegular}
              className="text-2xl drop-shadow-sm"
            />
          </button>
        </div>
        <div className="border border-gray-200 bg-gray-50 rounded-xl p-5 h-[180px] overflow-y-auto text-base shadow-[0_8px_24px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-150">
          {originalText}
        </div>
      </div>

      {/* 번역 실행 / 이전 / 건너뛰기 / 다음 버튼 */}
      <div className="mb-8 flex justify-between items-center gap-4">
        {onTranslate && (
          <button
            onClick={onTranslate}
            className="px-6 py-2 rounded-xl border border-blue-500 bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150 disabled:opacity-50"
            disabled={isTranslating}
          >
            {isTranslating ? '번역 중...' : '번역 실행하기'}
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            className="px-5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold shadow hover:bg-gray-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-150 disabled:opacity-50"
            disabled={isTranslating}
          >
            이전
          </button>
          <button
            onClick={onSkip}
            className="px-5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold shadow hover:bg-gray-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-150 disabled:opacity-50"
            disabled={isTranslating}
          >
            건너뛰기
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold shadow hover:bg-gray-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-150 disabled:opacity-50"
            disabled={isTranslating}
          >
            다음
          </button>
        </div>
      </div>

      {/* 번역 결과 */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 tracking-tight">
          번역 결과
        </h3>
        <div className="flex flex-row justify-between gap-6 flex-1 overflow-hidden">
          {(['google', 'deepL'] as const).map((engine) => (
            <div
              key={engine}
              className="border border-gray-200 bg-gray-50 rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col h-full flex-1 transition-all duration-150"
            >
              <strong className="text-gray-700 mb-3 text-base text-center tracking-wide">
                {engine === 'google' ? 'Google' : 'DeepL'}
              </strong>
              <div className="flex-1 overflow-y-auto rounded-lg p-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-150 max-h-[220px]">
                {translations[engine]}
              </div>
              <button
                className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150 disabled:opacity-50"
                onClick={() => onSave(engine)}
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
