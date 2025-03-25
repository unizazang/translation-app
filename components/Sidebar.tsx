import SidebarTabs from "./SidebarTabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  currentIndex: number;
  onSentenceSelect: (index: number) => void;
  groupedSentences: string[][];
  skippedIndexes: Set<number>;
  translatedIndexes: Set<number>;
  starredIndexes: Set<number>;
  onToggleStar: (index: number) => void;
  onMarkAsReviewed: (indexes: number[]) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isPdfUploaded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentIndex,
  onSentenceSelect,
  groupedSentences,
  skippedIndexes,
  translatedIndexes,
  starredIndexes,
  onToggleStar,
  onMarkAsReviewed,
  isSidebarCollapsed,
  onToggleSidebar,
  isPdfUploaded,
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
        onMarkAsReviewed={onMarkAsReviewed}
        isSidebarCollapsed={isSidebarCollapsed}
      />
    </div>
  );
};

export default Sidebar; 