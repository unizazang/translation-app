"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export function useUser() {
  const [user, setUser] = useState<null | { id: string }>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      setUser(user ? { id: user.id } : null);
    };

    fetchUser();
  }, []);

  return user;
}
