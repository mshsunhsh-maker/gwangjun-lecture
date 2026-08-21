import Link from "next/link";
import { FileText, Menu } from "lucide-react";
export function MobileHeader(){return <header className="mobile-header flex items-center justify-between border-b border-[#e6e0d6] bg-[#efeadf] px-5 py-4"><Link href="/" className="flex items-center gap-2 font-bold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#405b45] text-white"><FileText size={15}/></span>Hi베짱</Link><Link href="/settings" aria-label="메뉴 및 설정" className="rounded-lg p-2"><Menu size={20}/></Link></header>}
