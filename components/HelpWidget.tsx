"use client";

import { useState } from "react";
import HelpButton from "./HelpButton";
import HelpPanel from "./HelpPanel";

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ✅ 플로팅 버튼 (FAB) */}
      <HelpButton onClick={() => setIsOpen(!isOpen)} />

      {/* ✅ 슬라이드 패널 */}
      <HelpPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
