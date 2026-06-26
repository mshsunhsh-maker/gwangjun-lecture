import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Lecture } from "./types";
import { sampleLectures } from "./sampleData";
import { mapToLecture } from "./mapLecture";

// 사전 수집 스크립트(scripts/fetch-data.mjs)가 생성하는 광주·전남 원본 파일
const GENERATED_PATH = join(process.cwd(), "lib", "rawLectures.generated.json");

/**
 * 공공데이터포털 "전국평생학습강좌표준데이터" API
 * 데이터셋: https://www.data.go.kr/data/15013110/openapi.do
 */
const API_BASE =
  "https://api.data.go.kr/openapi/tn_pubr_public_lftm_lrn_lctre_api";

// API 페이지당 최대 행 수 (이 API의 상한은 1000)
const NUM_OF_ROWS = 1000;
// 안전장치: 최대로 순회할 페이지 수 (1000 × 40 = 40,000건까지 대응)
const MAX_PAGES = 40;

/**
 * 강연 데이터를 가져옵니다.
 * - PUBLIC_DATA_API_KEY 가 설정돼 있으면 실제 공공 API를 호출
 * - 키가 없거나 호출이 실패하면 샘플 데이터로 폴백
 *
 * 참고: "전국평생학습강좌표준데이터"에는 지자체뿐 아니라 공공도서관이
 * 운영하는 강좌도 포함됩니다. 따라서 키가 활성화되면 도서관 강좌도 함께
 * 수집되며, 화면의 "기관 > 공공도서관" 필터(기관명에 '도서관' 포함 여부)로
 * 걸러볼 수 있습니다. 도서관 전용 프로그램을 더 보강하려면 도서관정보나루
 * (data4library.kr) API를 별도 소스로 추가해 merge 하면 됩니다.
 */
// 모듈 레벨 캐시: 전국 26,599건 수집은 비싸므로 결과를 일정 시간 보관하고,
// 수집 중 들어온 동시 요청은 같은 in-flight 프로미스를 공유한다.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6시간
let cache: { data: Lecture[]; at: number } | null = null;
let inflight: Promise<Lecture[]> | null = null;

export async function getLectures(): Promise<Lecture[]> {
  const apiKey = process.env.PUBLIC_DATA_API_KEY;

  if (!apiKey) {
    console.warn(
      "[api] PUBLIC_DATA_API_KEY 미설정 → 샘플 데이터를 사용합니다. " +
        "실제 연동은 .env.local 에 키를 추가하세요."
    );
    return sampleLectures;
  }

  // 유효한 캐시가 있으면 즉시 반환
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }

  // 이미 수집 중이면 그 결과를 함께 기다림 (중복 수집 방지)
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      // 1순위: 사전 수집된 JSON (즉시, 네트워크 없음)
      const fromFile = await loadFromGeneratedFile();
      if (fromFile && fromFile.length > 0) {
        const result = hideEndedLectures(fromFile);
        cache = { data: result, at: Date.now() };
        return result;
      }

      // 2순위: 실시간 API 호출 (느림 — 폴백용)
      const lectures = await fetchFromPublicApi(apiKey);
      const result = hideEndedLectures(
        lectures.length > 0 ? lectures : sampleLectures
      );
      cache = { data: result, at: Date.now() };
      return result;
    } catch (err) {
      console.error("[api] 데이터 로드 실패 → 샘플 데이터로 폴백:", err);
      // 실패 시에는 캐시에 남기지 않아 다음 요청에서 재시도
      return sampleLectures;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/** 오늘 날짜를 YYYY-MM-DD 로 반환 */
function todayString(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

/**
 * "시작일 가까운 순" 정렬 (배열을 직접 정렬)
 * - 시작 예정(오늘 이후) 강좌: 시작일 빠른 순으로 앞쪽
 * - 진행 중(이미 시작) 강좌: 그 뒤에, 최근 시작 순
 */
function sortByUpcoming(lectures: Lecture[]): Lecture[] {
  const today = todayString();
  lectures.sort((a, b) => {
    const aUpcoming = a.startDate >= today;
    const bUpcoming = b.startDate >= today;
    if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1; // 예정 강좌 우선
    if (aUpcoming) return a.startDate < b.startDate ? -1 : 1; // 예정: 가까운 순
    return a.startDate > b.startDate ? -1 : 1; // 진행 중: 최근 시작 순
  });
  return lectures;
}

/**
 * 종료일이 지난 강좌를 숨깁니다.
 * - endDate(YYYY-MM-DD)가 오늘보다 이전이면 제외
 * - 종료일 정보가 없는 강좌는 안전하게 유지
 */
function hideEndedLectures(lectures: Lecture[]): Lecture[] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const before = lectures.length;
  const filtered = lectures.filter((l) => !l.endDate || l.endDate >= todayStr);
  console.log(
    `[api] 종료된 강좌 ${before - filtered.length}건 숨김 → 노출 ${filtered.length}건 (기준일 ${todayStr})`
  );
  return filtered;
}

/** 사전 수집된 광주·전남 원본 JSON을 읽어 Lecture[]로 변환 */
async function loadFromGeneratedFile(): Promise<Lecture[] | null> {
  try {
    const raw = await readFile(GENERATED_PATH, "utf-8");
    const items = JSON.parse(raw) as Record<string, string>[];
    if (!Array.isArray(items) || items.length === 0) return null;

    const mapped = items
      .map((item, i) => mapToLecture(item, i))
      .filter((l): l is Lecture => l !== null);

    const unique = Array.from(new Map(mapped.map((l) => [l.id, l])).values());
    sortByUpcoming(unique);

    console.log(
      `[api] 사전 수집 파일에서 광주·전남 강좌 ${unique.length}건 로드`
    );
    return unique;
  } catch {
    // 파일이 없으면 null → 실시간 API로 폴백
    return null;
  }
}

async function fetchFromPublicApi(apiKey: string): Promise<Lecture[]> {
  // 이 API는 주소 부분필터를 지원하지 않으므로 전국 데이터를 페이지 단위로
  // 모두 가져온 뒤, 매퍼에서 광주·전남만 남깁니다.
  const all: Lecture[] = [];
  let totalCount = Infinity;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const params = new URLSearchParams({
      serviceKey: apiKey,
      pageNo: String(page),
      numOfRows: String(NUM_OF_ROWS),
      type: "json",
    });
    const url = `${API_BASE}?${params.toString()}`;

    // 6시간마다 갱신 (ISR 캐시) — 개발계정 트래픽(1,000/일) 보호
    const res = await fetch(url, { next: { revalidate: 21600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const json = await res.json();
    const items = extractItems(json);

    if (page === 1) {
      totalCount = Number(getTotalCount(json)) || 0;
      if (items.length > 0) {
        console.log("[api] 응답 첫 항목 필드:", Object.keys(items[0]).join(", "));
      }
      console.log(`[api] 전국 강좌 총 ${totalCount}건 수집 시작`);
    }

    if (items.length === 0) break;

    for (const [i, item] of items.entries()) {
      const mapped = mapToLecture(item, (page - 1) * NUM_OF_ROWS + i);
      if (mapped) all.push(mapped);
    }

    // 마지막 페이지 도달 시 종료
    if (page * NUM_OF_ROWS >= totalCount) break;
  }

  // 중복 제거 (동일 강좌가 여러 행으로 들어오는 경우 대비)
  const unique = Array.from(new Map(all.map((l) => [l.id, l])).values());

  // 시작일 기준 정렬
  unique.sort((a, b) => (a.startDate < b.startDate ? -1 : 1));

  console.log(`[api] 광주·전남 강좌 ${unique.length}건 추출 완료`);
  return unique;
}

/** 응답 body의 totalCount 추출 */
function getTotalCount(json: unknown): string {
  return (json as any)?.response?.body?.totalCount ?? "0";
}

/** 공공데이터포털 표준 응답에서 items 배열을 안전하게 추출 */
function extractItems(json: unknown): Record<string, string>[] {
  // 표준 구조: { response: { body: { items: [...] } } }
  // 일부는 { response: { body: { items: { item: [...] } } } } 형태
  try {
    const body = (json as any)?.response?.body;
    const rawItems = body?.items;

    if (Array.isArray(rawItems)) return rawItems;
    if (Array.isArray(rawItems?.item)) return rawItems.item;
    if (rawItems?.item) return [rawItems.item];

    // 혹시 최상위에 바로 items가 오는 경우
    if (Array.isArray((json as any)?.items)) return (json as any).items;
  } catch {
    // 무시하고 빈 배열 반환
  }
  return [];
}

/** 단일 강연 조회 */
export async function getLectureById(id: string): Promise<Lecture | undefined> {
  const lectures = await getLectures();
  return lectures.find((l) => l.id === id);
}
