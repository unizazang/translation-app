"use client";

import Link from "next/link";

export default function GNB() {
  return (
    <nav className="w-full bg-blue-600 text-white p-3 shadow-md fixed top-0 left-0 z-50">
      <div className="relative">
        <div className="max-w-4xl ml-[100px] flex justify-start items-center gap-10">
          <Link
            href="/translate"
            className="hover:underline transition-all duration-300 ease-in-out"
          >
            PDF 번역
          </Link>
          <Link
            href="/extract-text"
            className="hover:underline transition-all duration-300 ease-in-out"
          >
            PDF 글자 추출
          </Link>
          <a href="">사용법 안내</a>
          <a
            href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=zifnffk32123@gmail.com&subject=%5BPDF%20번역기%5D%20버그%20제보&body=다음과%20같은%20버그가%20있습니다%3A%0A%0A1.%20발생%20위치%20(예%3A%20PDF%20업로드)%0A2.%20버그%20설명%0A3.%20스크린샷%20또는%20상세%20설명"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-all duration-300 ease-in-out"
          >
            버그 제보
          </a>
        </div>

        {/* 👉 절대 위치로 화면 오른쪽 끝에 고정 */}
        <p className="absolute right-5 top-1 text-sm text-white font-extralight">
          @shark_is_agent all rights reserved.
        </p>
      </div>
    </nav>
  );
}
