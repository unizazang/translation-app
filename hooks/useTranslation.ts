"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useTranslationLocal } from "./useTranslationLocal";
import { useTranslationSupabase } from "./useTranslationSupabase";

export function useTranslation(fileHash?: string, fileName?: string) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  if (userId && fileHash && fileName) {
    return useTranslationSupabase(userId, fileHash, fileName);
  } else {
    return useTranslationLocal();
  }
}
