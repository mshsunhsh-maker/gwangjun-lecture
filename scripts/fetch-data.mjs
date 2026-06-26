// 전국평생학습강좌표준데이터에서 광주·전남 강좌 원본을 수집해 JSON으로 저장합니다.
//
// 이 API는 페이지당 1000건 응답에 ~20초가 걸리고 주소 부분필터를 지원하지
// 않아, 요청 시점마다 호출하는 대신 이 스크립트로 미리 받아둡니다.
//
// 사용법:  node scripts/fetch-data.mjs
//   - .env.local 의 PUBLIC_DATA_API_KEY 를 읽습니다.
//   - 결과: lib/rawLectures.generated.json (광주·전남 원본 배열)

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const API_BASE =
  "https://api.data.go.kr/openapi/tn_pubr_public_lftm_lrn_lctre_api";
const NUM_OF_ROWS = 1000;
const CONCURRENCY = 5;
const MAX_RETRY = 4;
const TIMEOUT_MS = 45000;

function getApiKey() {
  if (process.env.PUBLIC_DATA_API_KEY) return process.env.PUBLIC_DATA_API_KEY;
  try {
    const env = readFileSync(join(ROOT, ".env.local"), "utf-8");
    const m = env.match(/PUBLIC_DATA_API_KEY=(.+)/);
    if (m) return m[1].trim();
  } catch {}
  throw new Error("PUBLIC_DATA_API_KEY 를 찾을 수 없습니다 (.env.local 확인).");
}

// 광주·전남 주소만 1차 필터 (정밀 분류는 앱의 mapLecture 가 수행)
function isGwangjuJeonnam(item) {
  const addr = String(item?.edcRdnmadr ?? "");
  return /광주|전라남도|전남/.test(addr);
}

async function fetchPage(apiKey, page) {
  const url =
    `${API_BASE}?serviceKey=${apiKey}&pageNo=${page}` +
    `&numOfRows=${NUM_OF_ROWS}&type=json`;

  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const body = json?.response?.body;
      const items = Array.isArray(body?.items)
        ? body.items
        : Array.isArray(body?.items?.item)
        ? body.items.item
        : [];
      return { items, total: Number(body?.totalCount ?? 0) };
    } catch (err) {
      clearTimeout(timer);
      if (attempt === MAX_RETRY) {
        console.warn(`  ! page ${page} 실패 (${MAX_RETRY}회): ${err.message}`);
        return { items: [], total: 0 };
      }
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  return { items: [], total: 0 };
}

async function main() {
  const apiKey = getApiKey();
  console.log("[fetch] 1페이지로 총 건수 확인 중...");
  const first = await fetchPage(apiKey, 1);
  const totalCount = first.total;
  const totalPages = Math.max(1, Math.ceil(totalCount / NUM_OF_ROWS));
  console.log(`[fetch] 전국 ${totalCount}건 / ${totalPages}페이지`);

  const collected = first.items.filter(isGwangjuJeonnam);
  const pages = [];
  for (let p = 2; p <= totalPages; p++) pages.push(p);

  // 동시성 제한 풀
  let idx = 0;
  let done = 1;
  async function worker() {
    while (idx < pages.length) {
      const page = pages[idx++];
      const { items } = await fetchPage(apiKey, page);
      for (const it of items) if (isGwangjuJeonnam(it)) collected.push(it);
      done++;
      if (done % 5 === 0 || done === totalPages) {
        console.log(
          `[fetch] ${done}/${totalPages} 페이지 완료, 광주·전남 누적 ${collected.length}건`
        );
      }
    }
  }
  await Promise.all(
    Array.from({ length: CONCURRENCY }, () => worker())
  );

  const outPath = join(ROOT, "lib", "rawLectures.generated.json");
  writeFileSync(outPath, JSON.stringify(collected, null, 0), "utf-8");
  console.log(
    `\n✅ 완료: 광주·전남 ${collected.length}건 → lib/rawLectures.generated.json`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
