// /lib/supabase-admin.ts

import { createClient } from "@supabase/supabase-js";

// 서버에서만 사용하는 Supabase 관리자 클라이언트 (Service Role Key 기반)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔐 반드시 .env.local 에 정의되어 있어야 함
);
