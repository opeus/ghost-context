import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";

export const metadata: Metadata = {
  title: "Ghost Context Exporter",
  description: "Export Ghost blog posts as AI context files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
