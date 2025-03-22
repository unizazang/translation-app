"use client";

import { useState, useEffect } from "react";

interface UseResizableProps {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
}

export const useResizable = ({
  initialWidth,
  minWidth,
  maxWidth,
}: UseResizableProps) => {
  const [width, setWidth] = useState<number>(initialWidth);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  return {
    width,
    isResizing,
    setIsResizing,
  };
};
