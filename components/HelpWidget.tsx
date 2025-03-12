"use client";

import { useState } from "react";
import HelpButton from "./HelpButton";
import HelpPanel from "./HelpPanel";

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false); // ✅ 상태 추가

  return (
    <>
      {/* ✅ 도움말 버튼 */}
      <HelpButton onClick={() => setIsOpen(!isOpen)} />

      {/* ✅ 패널 (isOpen 상태에 따라 표시) */}
      {isOpen && <HelpPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
