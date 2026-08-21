# Hi베짱 Content Studio — Codex Instructions

## Goal
Build a Korean living-blog operations dashboard that supports this workflow:
idea discovery → draft writing → SEO → hook → image planning → repurposing → 30-day calendar → pipeline → analytics.

## Development order
1. V1 UI skeleton with mock data only.
2. V2 content generation screens and reusable prompt library.
3. V3 localStorage persistence, calendar, Kanban, analytics.
4. V4 server API boundary and provider-agnostic AI integration.
5. V5 fresh trend/search integration and performance-based recommendations.

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Server-side API routes for future AI calls

## Rules
- Do not expose API keys in client code.
- Keep prompts under `lib/prompts`.
- Keep shared types under `lib/types.ts`.
- Use mock data until V1/V2 UI is stable.
- Prefer small reusable components over monolithic pages.
- Keep copy and UI labels in Korean.
- Design: cream/off-white base, sage green primary accent, muted pink secondary accent, charcoal text, spacious modern SaaS layout.
- Desktop-first but responsive.

## Required pages
- `/` 홈
- `/ideas` 오늘의 글감
- `/writer` 글 초안
- `/seo` SEO 최적화
- `/hooks` 도입부 만들기
- `/images` 이미지 기획
- `/repurpose` 콘텐츠 재활용
- `/calendar` 30일 캘린더
- `/pipeline` 콘텐츠 파이프라인
- `/analytics` 성과 분석
- `/settings` 설정

## V1 acceptance criteria
- App builds without TypeScript errors.
- Shared sidebar/layout exists.
- Dashboard has topic input, quick actions, KPI cards, recent content, top keywords, pipeline summary.
- Every required route exists with a usable placeholder page.
- Mock data is isolated from UI components.
