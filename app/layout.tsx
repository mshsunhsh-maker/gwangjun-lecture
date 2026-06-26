import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "빛고을 강연마당 | 광주·전남 무료강연 모아보기",
  description:
    "광주광역시·전라남도 지자체와 공공기관이 운영하는 무료강연을 한곳에서 검색하세요. 지역·분야·날짜별로 찾아보는 무료강연 정보 플랫폼.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "빛고을 강연마당",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <ServiceWorkerRegister />
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-lg font-bold tracking-tight">
                빛고을 강연마당
              </span>
            </Link>
            <span className="hidden text-sm text-slate-500 sm:inline">
              광주·전남 무료강연 모아보기
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-slate-500">
            <p>
              본 사이트는 공공데이터를 활용한 비영리 정보 서비스입니다. 신청
              전 각 기관의 공식 페이지에서 일정을 확인하세요.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
