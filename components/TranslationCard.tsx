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
    <div className="w-full h-full flex flex-col text-gray-900 font-medium">
      {/* 원문 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold text-gray-800">원본 문장</h3>
          <button onClick={onToggleStar} className="text-yellow-400 hover:text-yellow-500">
            <FontAwesomeIcon
              icon={isStarred ? faStarSolid : faStarRegular}
              className="text-xl"
            />
          </button>
        </div>
        <div className="border border-gray-300 bg-white rounded-xl p-4 h-[200px] overflow-y-auto text-sm shadow-sm">
          {originalText}
        </div>
      </div>

      {/* 번역 실행 / 이전 / 건너뛰기 / 다음 버튼 */}
      <div className="mb-6 flex justify-between items-center">
        {onTranslate && (
          <button
            onClick={onTranslate}
            className="px-5 py-2 rounded-xl border border-gray-300 bg-blue-500 text-white hover:bg-gray-100 transition disabled:opacity-50 shadow-sm"
            disabled={isTranslating}
          >
            {isTranslating ? '번역 중...' : '번역 실행하기'}
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            className="px-5 py-2 rounded-xl border border-gray-300  bg-blue-500 text-white hover:bg-gray-100 transition disabled:opacity-50 shadow-sm"
            disabled={isTranslating}
          >
            이전
          </button>
          <button
            onClick={onSkip}
            className="px-5 py-2 rounded-xl border border-gray-300  bg-blue-500 text-white hover:bg-gray-100 transition disabled:opacity-50 shadow-sm"
            disabled={isTranslating}
          >
            건너뛰기
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2 rounded-xl border border-gray-300  bg-blue-500 text-white hover:bg-gray-100 transition disabled:opacity-50 shadow-sm"
            disabled={isTranslating}
          >
            다음
          </button>
        </div>
      </div>

      {/* 번역 결과 */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-gray-800 mb-2">번역 결과</h3>
        <div className="flex flex-row justify-between gap-4 flex-1 overflow-hidden">
          {['google', 'deepL'].map((engine) => (
            <div
              key={engine}
              className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col h-full shadow-sm flex-1"
            >
              <strong className="text-gray-700 mb-2 text-base text-center" >
                {engine === 'google' ? 'Google' : 'DeepL'}
              </strong>
              <div className="flex-1 overflow-y-auto  bg-gray-50 rounded-lg p-3 text-sm shadow-inner">
                {translations[engine as keyof typeof translations]}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition"
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
