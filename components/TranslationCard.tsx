"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

interface TranslationCardProps {
  originalText: string;
  translations: {
    google: string;
    papago: string;
    deepL: string;
  };
  onSave: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isTranslating: boolean;
  isStarred: boolean;
  onToggleStar: () => void;
  onSkip: () => void;
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
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">번역할 텍스트</h2>
        <button
          onClick={onToggleStar}
          className="text-yellow-400 hover:text-yellow-500 transition-colors"
        >
          <FontAwesomeIcon
            icon={isStarred ? faStarSolid : faStarRegular}
            className="text-2xl"
          />
        </button>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-gray-700 whitespace-pre-wrap">{originalText}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Google 번역
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {translations.google}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Papago 번역
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {translations.papago}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">DeepL 번역</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {translations.deepL}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          disabled={isTranslating}
        >
          이전
        </button>
        <div className="flex gap-4">
          <button
            onClick={onSkip}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            disabled={isTranslating}
          >
            건너뛰기
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={isTranslating}
          >
            저장하기
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            disabled={isTranslating}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationCard;
