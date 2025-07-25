// lib/supabase-browser.ts
import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// 이 줄 추가 (SSR 환경에서 fetch 문제 해결)
if (!globalThis.fetch) {
  globalThis.fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
}

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
