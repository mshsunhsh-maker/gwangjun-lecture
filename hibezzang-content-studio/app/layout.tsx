import './globals.css';import Sidebar from '@/components/Sidebar';
export const metadata={title:'Hi베짱 Content Studio',description:'리빙 블로그 콘텐츠 운영 대시보드'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body><div className="shell"><Sidebar/><main className="main">{children}</main></div></body></html>}
