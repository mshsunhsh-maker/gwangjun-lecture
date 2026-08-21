export type ContentStatus = "아이디어" | "작성 중" | "이미지 제작" | "발행 예정" | "발행 완료";

export interface ContentItem {
  id: number;
  title: string;
  keyword: string;
  status: ContentStatus;
  publishedAt: string;
  views: number;
}

export interface KeywordStat { keyword: string; views: number; change: number }
export interface PipelineStat { label: ContentStatus; count: number; color: string }
