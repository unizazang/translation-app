"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Session } from "@supabase/auth-js";
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

  // ✅ auth state가 변할 때마다 session 갱신
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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

// ✅ 외부에서 session.user 접근 가능하도록
export const useSupabase = () => useContext(SupabaseContext);
