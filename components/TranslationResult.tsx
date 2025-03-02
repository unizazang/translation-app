"use client";

import React from "react";
import { useTextProcessing } from "@/hooks/useTextProcessing";
import TranslationCard from "@/components/TranslationCard";

const TranslationResult: React.FC<{ text: string }> = ({ text }) => {
  const { groupedSentences, processText } = useTextProcessing();

  // PDF 텍스트를 받아서 문장 분리 후 그룹화 실행
  React.useEffect(() => {
    if (text) processText(text);
  }, [text]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {groupedSentences.map((group, index) => (
        <TranslationCard key={index} textGroup={group} />
      ))}
    </div>
  );
};

export default TranslationResult;
