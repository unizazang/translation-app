"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js"; // ✅ 올바른 Session 타입 import
import { createContext, useContext, useEffect, useState } from "react";

const SupabaseContext = createContext<{
  supabase: ReturnType<typeof createBrowserClient>;
  session: Session | null;
}>({
  supabase: {} as ReturnType<typeof createBrowserClient>,
  session: null,
});

export default function SupabaseProvider({
  children,
  session: serverSession,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState<Session | null>(serverSession);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // ✅ 상태 동기화
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// ✅ 외부에서 supabase와 session 모두 접근 가능
export const useSupabase = () => useContext(SupabaseContext);
