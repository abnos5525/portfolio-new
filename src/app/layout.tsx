import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import { DirectionProvider } from "@/components/ui/direction";
import { cn } from "@/lib/utils";

import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hossein Heidary | Frontend Engineer",
  description:
    "Portfolio of Hossein Heidary — frontend engineer focused on React, TypeScript, and polished product UI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-accent="trust"
      className={cn("dark font-sans", vazirmatn.variable)}
    >
      <body className="min-h-dvh antialiased">
        <DirectionProvider direction="rtl">{children}</DirectionProvider>
      </body>
    </html>
  );
}
