"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

export default function AuthButton() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // 로그인 상태 가져오기
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
    };
    getUser();
  }, []);

  // 로그인
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  // 로그아웃
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    router.refresh(); // 세션 반영
  };

  return (
    <div className="absolute top-4 right-6 text-sm">
      {userEmail ? (
        <button
          onClick={handleLogout}
          className="text-red-600 border px-4 py-1 rounded hover:bg-red-50"
        >
          로그아웃 ({userEmail})
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="text-blue-600 border px-4 py-1 rounded hover:bg-blue-50"
        >
          구글 로그인
        </button>
      )}
    </div>
  );
}
