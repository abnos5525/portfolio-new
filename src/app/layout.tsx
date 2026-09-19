import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hossein Heidary | Frontend Engineer",
  description:
    "Portfolio of Hossein Heidary — frontend engineer focused on React, TypeScript, and polished product UI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
