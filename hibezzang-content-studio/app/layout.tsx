import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";

export const metadata: Metadata = { title: "Hi베짱 Content Studio", description: "리빙 블로그 콘텐츠를 기획하고 운영하는 작업 공간" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><div className="min-h-screen lg:grid lg:grid-cols-[244px_1fr]"><Sidebar /><MobileHeader /><main className="min-w-0 px-5 py-7 sm:px-8 lg:px-10 lg:py-9 xl:px-14">{children}</main></div></body></html>;
}
