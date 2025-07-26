"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "./provider"; // ✅ SupabaseProvider 기반

/**
 * 클라이언트에서 사용자 세션 및 user를 가져오는 커스텀 훅
 */
export function useUser() {
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

  return user;
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
