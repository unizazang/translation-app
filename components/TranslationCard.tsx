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
  onMarkAsReviewed: () => void;
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
  onMarkAsReviewed,
}) => {
  return (
    <div className="w-full border-gray-500 p-10 rounded-lg bg-white text-center text-black">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">원본 문장</h3>
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
      <p className="">{originalText}</p>

      <h3 className="text-lg font-semibold mt-10 border-t border-gray-300 pt-10 pb-10">
        번역 결과
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 space-y-4 mt-4 text-center">
        <div className="border border-gray-300 bg-white p-4 rounded-xl shadow-lg flex flex-col h-full">
          <strong className="block text-gray-700 m-3 text-lg">Google</strong>
          <p className="p-2 m-2 text-black">{translations.google}</p>
          <button
            className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-700 transition"
            onClick={onSave}
            disabled={isTranslating}
          >
            저장하기
          </button>
        </div>
        <div className="border border-gray-300 bg-white p-4 rounded-xl text-center shadow-lg flex flex-col h-full">
          <strong className="block text-gray-700 m-3 text-lg">Papago</strong>
          <p className="p-2 m-2 text-black">{translations.papago}</p>
          <button
            className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-700 transition"
            onClick={onSave}
            disabled={isTranslating}
          >
            저장하기
          </button>
        </div>
        <div className="border border-gray-300 bg-white p-4 rounded-xl text-center shadow-lg flex flex-col h-full">
          <strong className="block text-gray-700 m-3 text-lg">DeepL</strong>
          <p className="p-2 m-2 text-black">{translations.deepL}</p>
          <button
            className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-700 transition"
            onClick={onSave}
            disabled={isTranslating}
          >
            저장하기
          </button>
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
            onClick={onMarkAsReviewed}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            disabled={isTranslating}
          >
            검토 완료
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
