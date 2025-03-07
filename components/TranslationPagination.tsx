"use client";

import React from "react";

interface TranslationPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TranslationPagination: React.FC<TranslationPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Previous
      </button>
      <span>
        {currentPage + 1} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next
      </button>
    </div>
  );
};

export default TranslationPagination;
