"use client";

import Link from "next/link";

export default function GNB() {
  return (
    <nav className="w-full bg-blue-600 text-white p-4 shadow-md fixed top-0 left-0">
      <div className="max-w-4xl mx-auto flex justify-between">
        <Link
          href="/extract-text"
          className="hover:underline transition-all duration-300 ease-in-out"
        >
          📄 PDF 글자 추출
        </Link>
        <Link
          href="/translate"
          className="hover:underline transition-all duration-300 ease-in-out"
        >
          🌍 PDF 번역
        </Link>
      </div>
    </nav>
  );
}
