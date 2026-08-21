import type { ContentItem, KeywordStat, PipelineStat } from "./types";

export const kpis = [
  { label: "이번 달 발행", value: "12", unit: "편", change: "+3편", tone: "sage" },
  { label: "총 조회수", value: "48,920", unit: "회", change: "+18.2%", tone: "cream" },
  { label: "검색 유입", value: "72", unit: "%", change: "+5.4%", tone: "pink" },
  { label: "콘텐츠 수익", value: "₩842,000", unit: "", change: "+12.8%", tone: "lavender" },
];

export const recentContents: ContentItem[] = [
  { id: 1, title: "좁은 주방을 넓어 보이게 하는 수납 아이디어", keyword: "주방 수납", status: "발행 완료", publishedAt: "오늘", views: 3284 },
  { id: 2, title: "비 오는 날에도 향긋한 집, 패브릭 관리법", keyword: "장마철 빨래", status: "발행 예정", publishedAt: "8월 23일", views: 0 },
  { id: 3, title: "한 달 써본 무선 청소기 솔직 후기", keyword: "무선 청소기", status: "이미지 제작", publishedAt: "8월 25일", views: 0 },
  { id: 4, title: "가을을 준비하는 거실 컬러 조합 5가지", keyword: "가을 인테리어", status: "작성 중", publishedAt: "8월 28일", views: 0 },
];

export const topKeywords: KeywordStat[] = [
  { keyword: "주방 수납", views: 8420, change: 24 },
  { keyword: "원룸 인테리어", views: 6760, change: 18 },
  { keyword: "욕실 청소", views: 5140, change: 11 },
  { keyword: "살림 꿀팁", views: 4380, change: 9 },
  { keyword: "무선 청소기", views: 3210, change: 7 },
];

export const pipeline: PipelineStat[] = [
  { label: "아이디어", count: 8, color: "#e5bfc4" },
  { label: "작성 중", count: 4, color: "#d8cfa8" },
  { label: "이미지 제작", count: 3, color: "#b7c8a9" },
  { label: "발행 예정", count: 5, color: "#8fa580" },
  { label: "발행 완료", count: 12, color: "#405b45" },
];
