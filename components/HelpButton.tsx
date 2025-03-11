"use client";

import { useState } from "react";
import { motion } from "framer-motion";


interface HelpButtonProps {
    onClick: () => void; // ✅ onClick props 추가
  }

export default function HelpButton({ onClick }: HelpButtonProps) {
  const [showEffect, setShowEffect] = useState(false);

  const handleClick = () => {
    setShowEffect(true);
    setTimeout(() => setShowEffect(false), 500); // 0.5초 후 폭죽 효과 사라짐
  };

  return (
    <div className="fixed bottom-10 right-10 flex items-center justify-center">
      {/* 폭죽 효과 */}
      {showEffect && (
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-blue-400 opacity-50"
          animate={{ scale: [1, 3, 0], opacity: [1, 0.5, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* FAB 버튼 */}
      <motion.button
        whileTap={{ scale: 1.2 }} // 클릭 시 바운스 효과
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        onClick={handleClick}
        className="w-16 h-16 bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-600"
      >
        사용법 {/* 도움말 아이콘 */}
      </motion.button>
    </div>
  );
}
