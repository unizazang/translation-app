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
      <head />
      <body className="antialiased">
        <GNB />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
