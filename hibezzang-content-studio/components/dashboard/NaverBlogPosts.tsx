import { ArrowUpRight, BookOpen, ExternalLink } from "lucide-react";
import { getNaverBlogFeed } from "@/lib/naver-blog";

const formatter = new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" });

export async function NaverBlogPosts() {
  try {
    const feed = await getNaverBlogFeed();

    return <section className="card overflow-hidden xl:col-span-2">
      <div className="flex flex-col gap-3 border-b border-[#ebe7dd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2"><span className="eyebrow">Naver blog · Connected</span><span className="h-2 w-2 rounded-full bg-[#55a86b]" /></div>
          <h2 className="mt-1 truncate text-lg font-bold">{feed.title}</h2>
          <p className="mt-1 line-clamp-1 text-xs text-[#7a8078]">{feed.description}</p>
        </div>
        <a href={feed.link} target="_blank" rel="noreferrer" className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#3f7048]">내 블로그 보기 <ExternalLink size={13}/></a>
      </div>
      <div className="divide-y divide-[#eeeae1]">{feed.posts.slice(0, 4).map(post => {
        const date = new Date(post.publishedAt);
        return <a key={post.link} href={post.link} target="_blank" rel="noreferrer" className="group grid gap-2 px-5 py-4 transition hover:bg-[#faf8f2] sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0"><div className="mb-1.5 flex items-center gap-2"><span className="rounded-full bg-[#dce8d7] px-2 py-0.5 text-[10px] font-bold text-[#456045]">{post.category}</span><span className="text-[11px] text-[#8a9088]">{Number.isNaN(date.getTime()) ? "최근" : formatter.format(date)}</span></div><h3 className="truncate text-sm font-semibold group-hover:text-[#405b45]">{post.title}</h3><p className="mt-1 line-clamp-1 text-xs text-[#7a8078]">{post.description}</p></div><ArrowUpRight size={17} className="hidden text-[#8b9389] sm:block"/>
        </a>;
      })}</div>
    </section>;
  } catch {
    return <section className="card grid min-h-72 place-items-center p-8 text-center xl:col-span-2"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#dce5d7] text-[#405b45]"><BookOpen size={20}/></span><h2 className="mt-4 font-bold">네이버 블로그를 불러오지 못했어요</h2><p className="mt-2 text-xs text-[#777e75]">잠시 후 새로고침하거나 블로그에서 직접 확인해 주세요.</p><a href="https://blog.naver.com/n-mshsun" target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs font-bold text-[#405b45]">블로그 열기 →</a></div></section>;
  }
}
