"use client";

import { motion } from "framer-motion";

export default function HelpPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* ✅ 배경 클릭 시 닫기 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      )}

      {/* ✅ 패널 */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isOpen ? { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.3, duration: 0.6 } } : { y: "100%", opacity: 0, transition: { duration: 0.4 } }}
        exit={{ y: "100%", opacity: 0, transition: { duration: 0.3 } }}
        className="fixed bottom-0 left-0 w-full max-w-lg mx-auto h-[50vh] bg-white shadow-lg rounded-t-2xl overflow-y-auto"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

        {/* 가이드 내용 */}
        <div className="p-6 text-gray-800">
          <h2 className="text-xl font-semibold text-blue-600 ">📌 사용법 안내</h2>
          <p className="mt-2 text-gray-600">이 사이트는 PDF 번역을 돕는 도구입니다.</p>

          {/* ✅ 고유명사 관리 */}
          <div className="mt-4 border border-gray-300 rounded-lg p-3 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">📍 고유명사 관리</h3>
            <p className="text-gray-600 mt-1">
              번역 시 특정 단어가 원하는 방식으로 번역되도록 추가할 수 있습니다.
            </p>
            <p className="mt-2 text-gray-700 font-medium">📌 사용법:</p>
            <ul className="list-disc pl-5 text-gray-600 text-sm">
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
              이렇게 작성한 후 `.txt` 파일로 저장하고 <b>파일로 추가</b> 버튼을 사용하세요.
            </p>
            <p className="text-red-500 text-sm font-medium mt-1">
              ⚠ 고유명사를 추가한 후에는 반드시 새로고침을 해 주세요! 번역에 올바르게 반영됩니다.
            </p>
          </div>

          {/* ✅ PDF 업로드 */}
          <div className="mt-4 border border-gray-300 rounded-lg p-3 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">📂 PDF 업로드</h3>
            <p className="text-gray-600 mt-1">
              번역하고자 하는 <b>PDF 파일</b>을 업로드하세요.
            </p>
          </div>

          {/* ✅ 번역 시작 */}
          <div className="mt-4 border border-gray-300 rounded-lg p-3 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">🌐 번역 시작</h3>
            <p className="text-gray-600 mt-1">
              <b>원본 언어 선택</b>에서 언어를 선택한 후, <b>번역 시작</b>을 누르면 번역이 진행됩니다.
            </p>
          </div>

          {/* ✅ 번역 저장 */}
          <div className="mt-4 border border-gray-300 rounded-lg p-3 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">💾 번역 저장</h3>
            <p className="text-gray-600 mt-1">
              각각의 번역 카드에서 <b>저장하기</b>를 누르면 <b>저장된 번역</b>에 저장됩니다.
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
              <li>저장된 번역은 새로고침해도 유지됩니다.</li>
              <li>텍스트 박스 바깥을 클릭하거나 엔터 키를 누르면 자동으로 저장됩니다.</li>
              <li>또는 <b>브라우저 저장</b> 버튼을 클릭하세요.</li>
            </ul>
          </div>

          {/* ✅ 저장된 번역 */}
          <div className="mt-4 border text-black border-gray-300 rounded-lg p-3 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">📑 저장된 번역 관리</h3>
            <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
              <li>📋 <b>전체 복사</b>: 모든 번역을 클립보드에 복사합니다.</li>
              <li>❌ <b>초기화</b>: 모든 저장된 번역을 삭제합니다.</li>
              <li>💾 <b>TXT로 저장</b>: 번역을 `.txt` 파일로 다운로드합니다.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
}
