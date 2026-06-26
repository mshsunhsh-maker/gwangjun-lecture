import { Category, Lecture, Region } from "./types";

/**
 * 공공데이터포털 "전국평생학습강좌표준데이터" API 응답 1건을
 * 우리 앱의 Lecture 타입으로 변환합니다.
 *
 * 표준데이터라도 운영기관에 따라 필드명 표기가 조금씩 다를 수 있어,
 * 각 값마다 여러 후보 키를 순서대로 탐색하는 방어적 매핑을 사용합니다.
 */

// 원본 응답은 키/값이 모두 문자열인 평범한 객체
type RawItem = Record<string, string | number | null | undefined>;

/** 여러 후보 키 중 처음으로 값이 있는 것을 반환 */
function pick(item: RawItem, ...keys: string[]): string {
  for (const k of keys) {
    const v = item[k];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

/** YYYYMMDD / YYYY-MM-DD / YYYY.MM.DD 등을 YYYY-MM-DD로 정규화 */
function normalizeDate(raw: string): string {
  if (!raw) return "";
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length >= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return raw;
}

/** HHMM / HH:mm → HH:mm */
function normalizeTime(raw: string): string {
  if (!raw) return "";
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length >= 4) return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  return raw;
}

/** 광주·전남 시군구 → 우리 Region. 해당 지역이 아니면 null */
function detectRegion(address: string): Region | null {
  const a = address.replace(/\s/g, "");

  // 광주광역시 자치구
  if (a.includes("광주")) {
    if (a.includes("동구")) return "광주 동구";
    if (a.includes("서구")) return "광주 서구";
    if (a.includes("남구")) return "광주 남구";
    if (a.includes("북구")) return "광주 북구";
    if (a.includes("광산")) return "광주 광산구";
    return "전남 기타"; // 광주이지만 구 미상 → 임시 분류
  }

  // 전라남도 시군
  if (a.includes("전남") || a.includes("전라남도")) {
    if (a.includes("목포")) return "전남 목포시";
    if (a.includes("여수")) return "전남 여수시";
    if (a.includes("순천")) return "전남 순천시";
    if (a.includes("나주")) return "전남 나주시";
    if (a.includes("광양")) return "전남 광양시";
    if (a.includes("담양")) return "전남 담양군";
    if (a.includes("장성")) return "전남 장성군";
    return "전남 기타";
  }

  // 시군구명이 광역명 없이 들어오는 경우 보완
  const directMap: [string, Region][] = [
    ["담양", "전남 담양군"],
    ["장성", "전남 장성군"],
    ["목포", "전남 목포시"],
    ["여수", "전남 여수시"],
    ["순천", "전남 순천시"],
    ["나주", "전남 나주시"],
    ["광양", "전남 광양시"],
  ];
  for (const [needle, region] of directMap) {
    if (a.includes(needle)) return region;
  }

  return null;
}

/** 강좌명·내용·대분류로부터 분야를 추정 */
function inferCategory(text: string, rawCategory: string): Category {
  const hay = `${rawCategory} ${text}`;
  const rules: [RegExp, Category][] = [
    [/인문|역사|철학|고전|문학|글쓰기/, "인문학"],
    [/건강|의료|운동|체조|요가|영양|보건|치매/, "건강/의료"],
    [/재테크|경제|금융|투자|부동산|연금|세무|자산/, "재테크/경제"],
    [/IT|디지털|컴퓨터|코딩|스마트폰|AI|인공지능|엑셀|영상편집/, "IT/디지털"],
    [/문화|예술|미술|음악|사진|공예|그림|악기|서예|캘리/, "문화/예술"],
    [/취업|창업|일자리|사업|마케팅|면접|이력서|귀농|귀촌/, "취업/창업"],
    [/육아|부모|자녀|가정|임신|출산|아동/, "육아/가정"],
  ];
  for (const [re, cat] of rules) {
    if (re.test(hay)) return cat;
  }
  return "기타";
}

/** 수강료 문자열에서 무료 여부 판단 */
function detectFree(cost: string): boolean {
  if (!cost) return true; // 표기 없으면 무료로 간주
  const c = cost.replace(/\s/g, "");
  if (/무료|0원|^0$|free/i.test(c)) return true;
  const num = Number(c.replace(/[^0-9]/g, ""));
  return num === 0;
}

/**
 * 원본 1건 → Lecture. 광주·전남 지역이 아니면 null을 반환해 제외합니다.
 */
/** 고유 ID 필드가 없어 주요 값으로 안정적인 ID를 생성 (전체 문자열 해시) */
function makeStableId(parts: string[], index: number): string {
  const base = parts.filter(Boolean).join("|");
  if (!base) return `api-${index}`;
  // FNV-1a 32bit 해시로 전체 문자열을 반영 (충돌 최소화)
  let h = 0x811c9dc5;
  for (let i = 0; i < base.length; i++) {
    h ^= base.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

export function mapToLecture(item: RawItem, index: number): Lecture | null {
  // 실제 API 필드명을 우선, 표기가 다른 환경을 위한 후보를 뒤에 둠
  const address = pick(
    item,
    "edcRdnmadr", // 교육장도로명주소 (실제)
    "rdnmadr",
    "lnmadr",
    "edcPlace"
  );

  const region = detectRegion(address || pick(item, "operInstitutionNm", "insttNm"));
  if (!region) return null; // 광주·전남 외 지역 제외

  const title = pick(item, "lctreNm", "courseNm", "title");
  const description = pick(item, "lctreCo", "lctreCn", "courseCn", "remark");
  const rawCategory = pick(item, "edcTrgetType", "lclasNm", "mlsfcNm");
  const cost = pick(item, "lctreCost", "tuitionFee");

  const startDate = normalizeDate(
    pick(item, "edcStartDay", "eduStartDate", "startDate")
  );
  const endDate = normalizeDate(
    pick(item, "edcEndDay", "eduEndDate", "endDate")
  );
  const startTime = normalizeTime(
    pick(item, "edcStartTime", "eduStartTime", "startTime")
  );
  const applyStartDate = normalizeDate(
    pick(item, "rceptStartDate", "rcptStartDate", "applyStartDate")
  );
  const applyEndDate = normalizeDate(
    pick(item, "rceptEndDate", "rcptEndDate", "applyEndDate")
  );

  const capacityStr = pick(item, "psncpa", "rcritNmpr", "capacity");
  const capacity = capacityStr ? Number(capacityStr.replace(/[^0-9]/g, "")) : undefined;

  const organization =
    pick(item, "operInstitutionNm", "insttNm") || "기관 미상";

  return {
    id: makeStableId([organization, title, startDate], index),
    title: title || "(제목 없음)",
    description: description || "",
    organization,
    region,
    category: inferCategory(`${title} ${description}`, rawCategory),
    venue: pick(item, "edcPlace", "operPlaceNm", "eduPlaceNm") || address || "장소 미정",
    startDate: startDate || "",
    endDate: endDate || startDate || "",
    startTime: startTime || undefined,
    applyStartDate: applyStartDate || undefined,
    applyEndDate: applyEndDate || undefined,
    capacity: capacity && !Number.isNaN(capacity) ? capacity : undefined,
    applyUrl: pick(item, "homepageUrl", "hmpgUrl", "url") || undefined,
    contact: pick(item, "operPhoneNumber", "operInstitutionTelno", "telno") || undefined,
    isFree: detectFree(cost),
    source: organization || "공공데이터포털 평생학습강좌",
  };
}
