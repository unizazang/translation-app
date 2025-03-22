"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Settings from "./Settings";

const ProperNounManager = dynamic(() => import("./ProperNounManager"), {
  ssr: false,
});

const SentenceList = dynamic(() => import("./SentenceList"), {
  ssr: false,
});

interface SidebarTabsProps {
  currentIndex: number;
  onSentenceSelect: (index: number) => void;
  groupedSentences: string[][];
  skippedIndexes: Set<number>;
  translatedIndexes: Set<number>;
  starredIndexes: Set<number>;
  onToggleStar: (index: number) => void;
}

const SidebarTabs: React.FC<SidebarTabsProps> = ({
  currentIndex,
  onSentenceSelect,
  groupedSentences,
  skippedIndexes,
  translatedIndexes,
  starredIndexes,
  onToggleStar,
}) => {
  const [activeTab, setActiveTab] = useState("sentences");

  const tabs = [
    { id: "sentences", label: "문장 목록" },
    { id: "settings", label: "설정" },
    { id: "properNouns", label: "고유명사" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "sentences":
        return (
          <SentenceList
            currentIndex={currentIndex}
            onSentenceSelect={onSentenceSelect}
            groupedSentences={groupedSentences}
            skippedIndexes={skippedIndexes}
            translatedIndexes={translatedIndexes}
            starredIndexes={starredIndexes}
            onToggleStar={onToggleStar}
          />
        );
      case "settings":
        return <Settings />;
      case "properNouns":
        return <ProperNounManager />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
    </div>
  );
};

export default SidebarTabs;
