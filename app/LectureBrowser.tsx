"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Category, Lecture, Region } from "@/lib/types";

const REGIONS: Region[] = [
  "광주 동구",
  "광주 서구",
  "광주 남구",
  "광주 북구",
  "광주 광산구",
  "전남 목포시",
  "전남 여수시",
  "전남 순천시",
  "전남 나주시",
  "전남 광양시",
  "전남 담양군",
  "전남 장성군",
  "전남 기타",
];

const CATEGORIES: Category[] = [
  "인문학",
  "건강/의료",
  "재테크/경제",
  "IT/디지털",
  "문화/예술",
  "취업/창업",
  "육아/가정",
  "기타",
];

const CATEGORY_COLORS: Record<Category, string> = {
  인문학: "bg-amber-100 text-amber-800",
  "건강/의료": "bg-emerald-100 text-emerald-800",
  "재테크/경제": "bg-blue-100 text-blue-800",
  "IT/디지털": "bg-violet-100 text-violet-800",
  "문화/예술": "bg-rose-100 text-rose-800",
  "취업/창업": "bg-orange-100 text-orange-800",
  "육아/가정": "bg-pink-100 text-pink-800",
  기타: "bg-slate-100 text-slate-700",
};

// 기관유형 필터 옵션
type OrgType = "전체" | "공공도서관" | "지자체·공공기관";
const ORG_TYPES: OrgType[] = ["전체", "공공도서관", "지자체·공공기관"];

// 접수상태 필터 옵션
type ApplyFilter = "전체" | "접수중" | "접수예정";
const APPLY_FILTERS: ApplyFilter[] = ["전체", "접수중", "접수예정"];

type ApplyStatus = "접수중" | "접수예정" | "접수마감" | "미정";

/** 접수시작·마감일로 접수상태를 판별 */
function getApplyStatus(applyStartDate?: string, applyEndDate?: string): ApplyStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const t = today.getTime();

  const start = applyStartDate ? new Date(`${applyStartDate}T00:00:00`).getTime() : NaN;
  const end = applyEndDate ? new Date(`${applyEndDate}T00:00:00`).getTime() : NaN;

  if (!Number.isNaN(start) && start > t) return "접수예정";
  if (!Number.isNaN(end) && end < t) return "접수마감";
  if (!Number.isNaN(start) || !Number.isNaN(end)) return "접수중";
  return "미정"; // 접수정보 없음 (상시·현장접수 가능성)
}

/** 기관명으로 도서관 여부 판별 */
function isLibrary(organization: string): boolean {
  return organization.includes("도서관");
}

/**
 * 접수일정 기준 마감임박 라벨을 반환.
 * - 접수마감일(applyEndDate)이 오늘~7일 이내일 때만 표시
 * - 접수가 아직 시작 전(접수시작일이 미래)이면 표시하지 않음
 * - 마감 정보가 없거나 이미 지났거나 7일 초과면 null
 */
function getDeadlineBadge(
  applyStartDate?: string,
  applyEndDate?: string
): string | null {
  if (!applyEndDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 접수 시작 전이면 마감임박 아님
  if (applyStartDate) {
    const start = new Date(`${applyStartDate}T00:00:00`);
    if (!Number.isNaN(start.getTime()) && start.getTime() > today.getTime()) {
      return null;
    }
  }

  const end = new Date(`${applyEndDate}T00:00:00`);
  if (Number.isNaN(end.getTime())) return null;
  const diffDays = Math.round((end.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0 || diffDays > 7) return null;
  return diffDays === 0 ? "오늘마감" : `마감임박 D-${diffDays}`;
}

function formatDate(start: string, end: string): string {
  if (!start && !end) return "미정";
  if (!end || start === end) return start;
  if (!start) return `~ ${end}`;
  return `${start} ~ ${end}`;
}

export default function LectureBrowser({ lectures }: { lectures: Lecture[] }) {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState<Region | "전체">("전체");
  const [category, setCategory] = useState<Category | "전체">("전체");
  const [orgType, setOrgType] = useState<OrgType>("전체");
  const [applyFilter, setApplyFilter] = useState<ApplyFilter>("전체");

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return lectures.filter((l) => {
      if (region !== "전체" && l.region !== region) return false;
      if (category !== "전체" && l.category !== category) return false;
      if (orgType === "공공도서관" && !isLibrary(l.organization)) return false;
      if (orgType === "지자체·공공기관" && isLibrary(l.organization)) return false;
      if (applyFilter !== "전체") {
        const status = getApplyStatus(l.applyStartDate, l.applyEndDate);
        // 접수중: 진행 중 + 접수정보 없는(상시) 강좌 포함
        if (applyFilter === "접수중" && status !== "접수중" && status !== "미정")
          return false;
        if (applyFilter === "접수예정" && status !== "접수예정") return false;
      }
      if (kw) {
        const haystack =
          `${l.title} ${l.description} ${l.organization} ${l.venue}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  }, [lectures, keyword, region, category, orgType, applyFilter]);

  return (
    <div>
      {/* 검색창 */}
      <div className="mb-6">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="강연 제목, 기관, 장소로 검색하세요"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {/* 필터 */}
      <div className="mb-4 space-y-3">
        <FilterRow
          label="지역"
          options={["전체", ...REGIONS]}
          selected={region}
          onSelect={(v) => setRegion(v as Region | "전체")}
        />
        <FilterRow
          label="분야"
          options={["전체", ...CATEGORIES]}
          selected={category}
          onSelect={(v) => setCategory(v as Category | "전체")}
        />
        <FilterRow
          label="기관"
          options={ORG_TYPES}
          selected={orgType}
          onSelect={(v) => setOrgType(v as OrgType)}
        />
        <FilterRow
          label="접수"
          options={APPLY_FILTERS}
          selected={applyFilter}
          onSelect={(v) => setApplyFilter(v as ApplyFilter)}
        />
      </div>

      <p className="mb-4 text-sm text-slate-500">
        총 <span className="font-semibold text-slate-700">{filtered.length}</span>
        개의 무료강연
      </p>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-400">
          조건에 맞는 강연이 없습니다.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((l) => (
            <li key={l.id}>
              <Link
                href={`/lecture/${l.id}`}
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[l.category]}`}
                  >
                    {l.category}
                  </span>
                  {l.isFree && (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      무료
                    </span>
                  )}
                  {isLibrary(l.organization) && (
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800">
                      📚 도서관
                    </span>
                  )}
                  {getDeadlineBadge(l.applyStartDate, l.applyEndDate) && (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                      ⏰ {getDeadlineBadge(l.applyStartDate, l.applyEndDate)}
                    </span>
                  )}
                  {getApplyStatus(l.applyStartDate, l.applyEndDate) ===
                    "접수예정" && (
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                      접수예정
                    </span>
                  )}
                </div>
                <h3 className="mb-1 text-base font-semibold leading-snug">
                  {l.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                  {l.description}
                </p>
                <div className="mt-auto space-y-1 text-sm text-slate-600">
                  <p>📅 교육 {formatDate(l.startDate, l.endDate)}</p>
                  {(l.applyStartDate || l.applyEndDate) && (
                    <p>📝 접수 {formatDate(l.applyStartDate ?? "", l.applyEndDate ?? "")}</p>
                  )}
                  <p>📍 {l.region} · {l.venue}</p>
                  <p>🏛️ {l.organization}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-10 shrink-0 text-sm font-medium text-slate-500">
        {label}
      </span>
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`rounded-full px-3 py-1 text-sm transition ${
              active
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
