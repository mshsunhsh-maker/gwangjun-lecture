# Hi베짱 Content Studio — Codex Build Plan

Codex는 아래 단계를 순서대로 실행한다. 한 단계가 빌드/타입체크를 통과하기 전 다음 단계로 넘어가지 않는다.

## V1 — 프로젝트 뼈대

### Prompt
Next.js + TypeScript + Tailwind CSS 기반의 `Hi베짱 Content Studio`를 이 폴더 안에 구현한다. 실제 AI API는 연결하지 않는다.

필수 작업:
- App Router 프로젝트 구조 정리
- 공통 레이아웃, Sidebar, Header
- 홈 대시보드
- 모든 필수 메뉴 route 생성
- `lib/mock-data.ts`, `lib/types.ts` 분리
- 반응형 UI

홈 대시보드:
- `오늘의 콘텐츠` 주제 입력창
- 글감 찾기 / 초안 작성 / SEO 분석 / 도입부 / 이미지 기획 / 콘텐츠 재활용 quick actions
- 이번 달 발행 / 총 조회수 / 검색 유입 / 콘텐츠 수익 KPI
- 최근 콘텐츠
- 성과 좋은 키워드 TOP 5
- 파이프라인 요약

디자인:
- 크림/오프화이트 배경
- 세이지그린 포인트
- 톤다운 핑크 보조색
- 차콜 텍스트
- 둥근 카드와 충분한 여백
- 모던한 리빙 SaaS 느낌

완료 후 lint/typecheck/build를 실행하고 오류를 수정한다.

## V2 — 콘텐츠 제작 기능

### `/ideas`
입력: 분야(기본 리빙), 세부 키워드, 타깃.
결과 10개: title, mainKeyword, subKeywords, contentType, searchIntent, seasonality, difficulty, score.
필터: 전체/정보형/경험형/구매형/비교형/시즌형.
액션: 초안 만들기, SEO 분석, 저장.

### `/writer`
입력: 주제, 메인 키워드, 내 경험, 제품/장소, 가격, 중요 내용, 사진 유무.
스타일: 정보형/내돈내산 후기/비교형/생활정보/스토리형.
결과: 제목 후보, 훅, 도입, 본문, 소제목, 핵심정보, 장점, 아쉬운 점, 추천대상, FAQ, CTA.

### `/seo`
SEO score, 메인/연관/롱테일 키워드, 검색의도, 검색형/홈판형/경험형 제목 각 5개, 소제목, 메타 설명, 태그, 개선사항.

### `/hooks`
궁금증형/공감형/손해회피형/경험형/숫자형 도입부 각 3개.

### `/images`
썸네일 기획, 본문 이미지 5개, 카드뉴스 5장, 숏폼 이미지 아이디어. 이미지 생성 프롬프트 복사 기능.

### `/repurpose`
릴스 30초 대본, 카드뉴스, Threads, 뉴스레터, 짧은 SNS 게시물 탭.

V2까지 mock generator를 사용한다. 생성 로직과 UI를 분리하고 `lib/prompts` 폴더를 만든다.

## V3 — 운영 관리

### `/calendar`
월간/리스트 전환. 날짜, 주제, 유형, 키워드, 우선순위, 상태, 발행 예정 시간. 추가/수정 Modal. localStorage 저장.

### `/pipeline`
Kanban: 아이디어 / 작성중 / 이미지 제작 / 발행 예정 / 발행 완료. Drag & drop으로 상태 변경. 상세 Modal.

### `/analytics`
조회수, 검색 유입, 홈 유입, 댓글, 공감, 저장, 수익 입력. KPI와 TOP 콘텐츠/키워드/유형별 평균 조회수 차트.

공통 콘텐츠 상태와 draft를 localStorage persistence layer로 통합한다.

## V4 — AI 연결 준비

`app/api/generate/route.ts`와 provider layer를 만든다.

요청 형식:
```json
{
  "type": "ideas",
  "topic": "...",
  "context": {}
}
```

지원 type:
- ideas
- writer
- seo
- hooks
- images
- repurpose
- strategy

API key는 서버 환경변수에서만 읽는다. `lib/prompts/*.ts`가 prompt builder를 담당한다. provider 구현은 교체 가능하게 만든다. AI 응답은 가능한 한 typed JSON으로 normalize한다.

## V5 — 최신 트렌드/성과 루프

추후 외부 검색 또는 허용된 트렌드 데이터 소스를 붙일 수 있도록 `TrendProvider` 인터페이스를 만든다.
흐름: 최신 트렌드 → 키워드/글감 → 콘텐츠 생성 → 발행/성과 기록 → 성과 기반 다음 주제 추천.

## Final verification
각 버전 완료 시:
1. 변경 파일 요약
2. 실행한 검증 명령
3. 남은 TODO
4. 다음 버전 시작 조건
을 보고한다.
