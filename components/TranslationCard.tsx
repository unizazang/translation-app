import React from "react";

interface TranslationCardProps {
  textGroup: string[];
}

const TranslationCard: React.FC<TranslationCardProps> = ({ textGroup }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      {textGroup.map((sentence, index) => (
        <p key={index} className="text-lg leading-relaxed mb-2">
          {sentence}
        </p>
      ))}
    </div>
  );
};

export default TranslationCard;
