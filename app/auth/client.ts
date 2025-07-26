"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "./provider"; // ✅ SupabaseProvider 기반
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

/**
 * 클라이언트에서 사용자 세션 및 user를 가져오는 커스텀 훅
 */

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ provider.tsx에서 SupabaseContext 가져옴

export function useUser() {
  const { session } = useSupabase();
  return session?.user ?? null;
}

export function useUserWithLoading() {
  const { session } = useSupabase();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [session]);

  return { user, loading };
}
