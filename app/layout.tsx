import "./globals.css";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import SupabaseProvider from "@/app/auth/provider";

export const metadata = {
  title: "번역기 앱",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // ❌ SSR 환경에서는 set/remove 호출 금지
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <SupabaseProvider session={session}>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
