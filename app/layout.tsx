export const dynamic = "force-dynamic";


import GNB from "@/components/GNB";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased` }>
        <GNB />
        <main className="pt-16 p-8">{children}</main> {/* ✅ GNB 높이 고려하여 pt-16 추가 */}
      </body>
    </html>
  );
}
