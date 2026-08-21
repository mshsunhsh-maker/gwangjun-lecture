"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, FileText, Home, Image, Lightbulb, PenLine, RefreshCw, Search, Settings, Sparkles, Workflow } from "lucide-react";

const menus = [
  ["/", "홈", Home], ["/ideas", "오늘의 글감", Lightbulb], ["/writer", "글 초안", PenLine], ["/seo", "SEO 최적화", Search],
  ["/hooks", "도입부 만들기", Sparkles], ["/images", "이미지 기획", Image], ["/repurpose", "콘텐츠 재활용", RefreshCw],
  ["/calendar", "30일 캘린더", CalendarDays], ["/pipeline", "콘텐츠 파이프라인", Workflow], ["/analytics", "성과 분석", BarChart3], ["/settings", "설정", Settings],
] as const;

export function Sidebar() {
  const path = usePathname();
  return <aside className="desktop-sidebar sticky top-0 h-screen border-r border-[#e6e0d6] bg-[#efeadf] px-4 py-7">
    <Link href="/" className="mb-9 flex items-center gap-3 px-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#405b45] text-white"><FileText size={19}/></span><span><b className="block text-[17px]">Hi베짱</b><small className="text-[11px] font-semibold tracking-wider text-[#778075]">CONTENT STUDIO</small></span></Link>
    <nav aria-label="주 메뉴" className="space-y-1">{menus.map(([href,label,Icon]) => { const active=path===href; return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition ${active?"bg-[#405b45] text-white shadow-sm":"text-[#596057] hover:bg-white/70"}`}><Icon size={17}/>{label}</Link>; })}</nav>
    <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#dce4d7] p-4"><p className="text-xs font-bold text-[#405b45]">이번 주 콘텐츠</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full w-3/5 rounded-full bg-[#6f8769]"/></div><p className="mt-2 text-[11px] text-[#647061]">목표 5편 중 3편 완료</p></div>
  </aside>;
}
