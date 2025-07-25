// auth/client.ts (수정)
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("❌ 유저 가져오기 실패:", error.message);
    } else {
      console.log("✅ Supabase 유저 가져오기 성공:", user);
      setUser(user);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 auth state changed:", event);
        await fetchUser();
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return loading ? null : user;
}
