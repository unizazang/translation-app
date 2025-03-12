"use client";

import { motion } from "framer-motion";

export default function HelpPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* ✅ 배경 (클릭 시 모달 닫기) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        />
      )}

      {/* ✅ 중앙 모달 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="bg-white max-w-2xl w-full h-auto p-6 rounded-lg shadow-lg relative">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-5 text-gray-500 hover:text-gray-800 text-2xl"
          >
            ✕
          </button>

          {/* ✅ 가이드 내용 */}
          <h2 className="text-xl font-semibold text-blue-600 text-center">📌 사용법 안내</h2>
          <p className="mt-2 text-gray-600 text-center">
            이 사이트는 PDF 번역을 돕는 도구입니다.
          </p>

          {/* ✅ 고유명사 관리 */}
          <div className="mt-4 border border-gray-300 rounded-lg p-3 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">📍 고유명사 관리</h3>
            <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
              <li>고유명사와 그 번역어를 입력한 후 <b>추가</b> 버튼을 누릅니다.</li>
              <li>번역 시 입력한 대로 적용됩니다.</li>
            </ul>

            {/* ✅ 파일로 추가 */}
            <p className="mt-2 text-gray-700 font-medium">📁 파일로 추가:</p>
            <div className="border border-gray-400 p-2 bg-white text-sm rounded-md">
              <code>
                원본 단어: 번역 단어 <br />
                원본 단어2: 번역 단어2 <br />
                원본 단어3: 번역 단어3
              </code>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              `.txt` 파일로 저장한 후 <b>파일로 추가</b> 버튼을 사용하세요.
            </p>
          </div>

          {/* ✅ PDF 업로드 */}
          <div className="mt-4 border border-gray-300 rounded-lg p-3 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">📂 PDF 업로드</h3>
            <p className="text-gray-600 mt-1">번역하고자 하는 <b>PDF 파일</b>을 업로드하세요.</p>
          </div>

          {/* ✅ 번역 시작 */}
          <div className="mt-4 border border-gray-300 rounded-lg p-3 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">🌐 번역 시작</h3>
            <p className="text-gray-600 mt-1">
              <b>원본 언어 선택</b>에서 언어를 선택한 후, <b>번역 시작</b>을 누르면 번역이 진행됩니다.
            </p>
          </div>

          {/* ✅ 닫기 버튼 */}
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              닫기
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
