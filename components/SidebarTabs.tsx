"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Settings from "./Settings";
import SidebarProgress from "./SidebarProgress";
import { PdfPageData } from "@/lib/pdfProcessor";

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
  pdfPages: PdfPageData[][];
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
  pdfPages,
}) => {
  const [activeTab, setActiveTab] = useState("properNouns");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  if (!isPdfUploaded) {
    return null;
  }

  const tabs = [
    { id: "properNouns", label: "예외 단어" },
    { id: "sentences", label: "문장 목록" },
    { id: "settings", label: "설정" },
  ];

  const handleTabChange = (tabId: string) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const newIndex = tabs.findIndex((tab) => tab.id === tabId);
    setSlideDirection(newIndex > currentIndex ? "left" : "right");
    setActiveTab(tabId);
  };

  // 전체 페이지 수 계산
  const totalPages = pdfPages.length;
  
  // 현재 문장이 속한 페이지와 문장 수 계산
  let currentPage = 1;
  let totalSentencesBeforeCurrentPage = 0;
  let currentPageSentences = 0;
  let currentSentenceInPage = 0;

  for (let i = 0; i < pdfPages.length; i++) {
    const pageSentences = pdfPages[i][0].textBlocks.length;
    if (currentIndex < totalSentencesBeforeCurrentPage + pageSentences) {
      currentPage = i + 1;
      currentPageSentences = pageSentences;
      currentSentenceInPage = currentIndex - totalSentencesBeforeCurrentPage + 1;
      break;
    }
    totalSentencesBeforeCurrentPage += pageSentences;
  }

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

  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      zIndex: 0,
      x: direction === "right" ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div className="h-full p-4 flex flex-col bg-white shadow-md rounded-lg">
      {!isSidebarCollapsed && (
        <SidebarProgress
          totalPages={totalPages}
          currentPage={currentPage}
          currentIndex={currentIndex}
          totalSentences={currentPageSentences}
          currentSentenceInPage={currentSentenceInPage}
        />
      )}
      <div className="flex relative pb-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium relative z-10
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
                  }
                : undefined
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={activeTab}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <div className="h-[calc(100vh-12rem)] overflow-y-auto">
              {renderTabContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SidebarTabs;
