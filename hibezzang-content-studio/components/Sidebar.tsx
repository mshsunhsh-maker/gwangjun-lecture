import Link from 'next/link';
const items=[['/','홈'],['/ideas','오늘의 글감'],['/writer','글 초안'],['/seo','SEO 최적화'],['/hooks','도입부 만들기'],['/images','이미지 기획'],['/repurpose','콘텐츠 재활용'],['/calendar','30일 캘린더'],['/pipeline','콘텐츠 파이프라인'],['/analytics','성과 분석'],['/settings','설정']];
export default function Sidebar(){return <aside className="sidebar"><div className="brand">Hi베짱<small>CONTENT STUDIO</small></div><nav className="nav">{items.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}</nav></aside>}
