// 무료강연 정보 타입 정의

export type Region =
  | "광주 동구"
  | "광주 서구"
  | "광주 남구"
  | "광주 북구"
  | "광주 광산구"
  | "전남 목포시"
  | "전남 여수시"
  | "전남 순천시"
  | "전남 나주시"
  | "전남 광양시"
  | "전남 담양군"
  | "전남 장성군"
  | "전남 기타";

export type Category =
  | "인문학"
  | "건강/의료"
  | "재테크/경제"
  | "IT/디지털"
  | "문화/예술"
  | "취업/창업"
  | "육아/가정"
  | "기타";

export interface Lecture {
  id: string;
  title: string; // 강연 제목
  description: string; // 강연 설명
  organization: string; // 운영 기관 (지자체/공공기관)
  region: Region; // 지역
  category: Category; // 분야
  venue: string; // 장소
  startDate: string; // 시작일 (YYYY-MM-DD)
  endDate: string; // 종료일 (YYYY-MM-DD)
  startTime?: string; // 시작 시간 (HH:mm)
  applyStartDate?: string; // 접수 시작일 (YYYY-MM-DD)
  applyEndDate?: string; // 접수 마감일 (YYYY-MM-DD)
  capacity?: number; // 정원
  applyUrl?: string; // 신청 링크
  contact?: string; // 문의처
  isFree: boolean; // 무료 여부
  imageUrl?: string; // 대표 이미지
  source: string; // 데이터 출처
}
