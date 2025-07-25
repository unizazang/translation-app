// /app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // 로그인 완료 후 홈으로 리디렉션
    router.replace("/");
  }, [router]);

  return <p>로그인 처리 중입니다...</p>;
}
