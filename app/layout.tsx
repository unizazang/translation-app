export const dynamic = "force-dynamic";


import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>{children}
        {/* 사용법 가이드 위젯 */}
      </body>
    </html>
  );
}
