"use client";

import { useState, useCallback, useEffect } from "react";

interface UseResizableProps {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
}

export function useResizable({
  initialWidth,
  minWidth,
  maxWidth,
}: UseResizableProps) {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth < minWidth / 2) {
        setIsCollapsed(true);
        setWidth(0);
      } else {
        setIsCollapsed(false);
        setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
      }
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
    isCollapsed,
    handleResizeStart,
  };
}
