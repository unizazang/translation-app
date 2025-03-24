"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Settings from "./Settings";
import SidebarProgress from "./SidebarProgress";

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
  completedIndexes: Set<number>;
  isPdfUploaded: boolean;
  onMarkAsReviewed: (indexes: number[]) => void;
  isSidebarCollapsed: boolean;
}

const SidebarTabs: React.FC<SidebarTabsProps> = ({
  currentIndex,
  onSentenceSelect,
  groupedSentences,
  skippedIndexes,
  translatedIndexes,
  starredIndexes,
  onToggleStar,
  completedIndexes,
  isPdfUploaded,
  onMarkAsReviewed,
  isSidebarCollapsed,
}) => {
  const [activeTab, setActiveTab] = useState("sentences");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  if (!isPdfUploaded) {
    return null;
  }

  const tabs = [
    { id: "sentences", label: "문장 목록" },
    { id: "settings", label: "설정" },
    { id: "properNouns", label: "예외 단어" },
  ];

  const handleTabChange = (tabId: string) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const newIndex = tabs.findIndex((tab) => tab.id === tabId);
    setSlideDirection(newIndex > currentIndex ? "left" : "right");
    setActiveTab(tabId);
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(groupedSentences.length / 10);
  const currentPage = Math.floor(currentIndex / 10) + 1;

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
            onMarkAsReviewed={onMarkAsReviewed}
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
    <div className="h-full p-4 flex flex-col bg-white shadow-md rounded-lg ">
      {!isSidebarCollapsed && (
        <SidebarProgress
          totalPages={totalPages}
          currentPage={currentPage}
          completedIndexes={completedIndexes}
          totalSentences={groupedSentences.length}
        />
      )}
      <div className="flex  relative pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-300 relative z-10
              ${
                activeTab === tab.id
                  ? "text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }
              ${
                isSidebarCollapsed
                  ? "absolute right-0 w-full text-right hover:bg-gray-50"
                  : ""
              }`}
            style={
              isSidebarCollapsed
                ? {
                    top: `${tabs.findIndex((t) => t.id === tab.id) * 40}px`,
                    transform: "translateX(0)",
                    transition: "transform 0.3s ease-in-out",
                  }
                : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            slideDirection === "left" ? "translate-x-0" : "-translate-x-0"
          }`}
          style={{
            transform: `translateX(${slideDirection === "left" ? "0%" : "0%"})`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <div className="h-[calc(100vh-12rem)] overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarTabs;
