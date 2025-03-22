import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faBook } from "@fortawesome/free-solid-svg-icons";
import SentenceList from "./SentenceList";
import ProperNounManager from "./ProperNounManager";

type TabType = "sentences" | "properNouns";

interface SidebarTabsProps {
  sentences: string[][];
  currentIndex: number;
  translatedIndexes: Set<number>;
  skippedIndexes: Set<number>;
  starredIndexes: Set<number>;
  onSentenceSelect: (index: number) => void;
  onToggleStar: (index: number) => void;
}

export default function SidebarTabs({
  sentences,
  currentIndex,
  translatedIndexes,
  skippedIndexes,
  starredIndexes,
  onSentenceSelect,
  onToggleStar,
}: SidebarTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("sentences");

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("sentences")}
          className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 
            ${
              activeTab === "sentences"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          <FontAwesomeIcon icon={faList} />
          <span>문장 리스트</span>
        </button>
        <button
          onClick={() => setActiveTab("properNouns")}
          className={`flex-1 px-4 py-3 flex items-center justify-center gap-2
            ${
              activeTab === "properNouns"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          <FontAwesomeIcon icon={faBook} />
          <span>단어 추가</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "sentences" ? (
          <div className="h-full p-4">
            <SentenceList
              sentences={sentences}
              currentIndex={currentIndex}
              translatedIndexes={translatedIndexes}
              skippedIndexes={skippedIndexes}
              starredIndexes={starredIndexes}
              onSentenceSelect={onSentenceSelect}
              onToggleStar={onToggleStar}
            />
          </div>
        ) : (
          <div className="h-full p-4">
            <ProperNounManager />
          </div>
        )}
      </div>
    </div>
  );
}
