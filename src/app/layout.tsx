import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "Aikitr Next.js + Supabase 模板",
    template: "%s | Aikitr",
  },
  description: "基于 Next.js、shadcn/ui 和 Supabase 的可复用起步模板。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
