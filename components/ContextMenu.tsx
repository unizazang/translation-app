"use client";

import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onMarkAsReviewed: () => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onMarkAsReviewed,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white shadow-lg rounded-lg py-2 z-50"
      style={{ left: x, top: y }}
    >
      <button
        onClick={onMarkAsReviewed}
        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
      >
        ✅ 검토 완료
      </button>
    </div>
  );
};

export default ContextMenu;
