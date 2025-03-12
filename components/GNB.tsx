"use client";

import Link from "next/link";

export default function GNB() {
  return (
    <nav className="w-full bg-blue-600 text-white p-4 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-4xl mx-auto flex justify-between">
        <Link href="/" className="hover:underline">
          🌍 PDF 번역
        </Link>
        <Link href="/extract-text" className="hover:underline">
          📄 PDF 글자 추출
        </Link>
      </div>
    </nav>
  );
}
