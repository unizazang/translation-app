import SidebarTabs from "./SidebarTabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { PdfPageData } from "../lib/pdfProcessor";

interface SidebarProps {
  currentIndex: number;
  onSentenceSelect: (index: number) => void;
  groupedSentences: string[][];
  skippedIndexes: Set<number>;
  translatedIndexes: Set<number>;
  starredIndexes: Set<number>;
  onToggleStar: (index: number) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isPdfUploaded: boolean;
  completedIndexes: Set<number>;
  pdfPages: PdfPageData[][];
}

const Sidebar: React.FC<SidebarProps> = ({
  currentIndex,
  onSentenceSelect,
  groupedSentences,
  skippedIndexes,
  translatedIndexes,
  starredIndexes,
  onToggleStar,
  isSidebarCollapsed,
  onToggleSidebar,
  isPdfUploaded,
  completedIndexes,
  pdfPages,
}) => {
  if (!isPdfUploaded) {
    return null;
  }

  return (
    <div className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${
      isSidebarCollapsed ? "w-12" : "w-96"
    }`}>
      <button
        onClick={onToggleSidebar}
        className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
      >
        <FontAwesomeIcon
          icon={isSidebarCollapsed ? faChevronLeft : faChevronRight}
          className="text-gray-600"
        />
      </button>
      <SidebarTabs
        currentIndex={currentIndex}
        onSentenceSelect={onSentenceSelect}
        groupedSentences={groupedSentences}
        skippedIndexes={skippedIndexes}
        translatedIndexes={translatedIndexes}
        starredIndexes={starredIndexes}
        onToggleStar={onToggleStar}
        isPdfUploaded={isPdfUploaded}
        isSidebarCollapsed={isSidebarCollapsed}
        completedIndexes={completedIndexes}
        pdfPages={pdfPages}
      />
    </div>
  );
};

export default Sidebar; 