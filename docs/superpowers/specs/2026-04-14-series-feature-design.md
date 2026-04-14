# 시리즈 기능 설계

**날짜:** 2026-04-14
**상태:** 승인됨
**대상 브랜치:** main

---

## 개요

블로그 포스트를 시리즈로 묶어 독자가 연재 흐름을 파악하고 탐색할 수 있게 하는 기능.
첫 번째 적용 대상: `대규모 시스템 설계 스터디` 시리즈.

---

## 결정 사항

| 항목 | 결정 |
|------|------|
| 시리즈 메타 저장 방식 | frontmatter (series, seriesSlug, seriesOrder) |
| 시리즈 탐색 UI 위치 | 포스트 헤더 아래 — 상단 접이식 패널 |
| 시리즈 인덱스 페이지 | `/series/[slug]` |
| PrevNextNav | 시리즈 포스트에서는 시리즈 순서 기준으로 교체 |
| draft 포스트 처리 | SeriesPanel에서 숨김 |

---

## 1. Frontmatter 구조

시리즈에 속하는 포스트는 다음 세 필드를 추가한다.

```yaml
series: "대규모 시스템 설계 스터디"   # 표시 이름
seriesSlug: "system-design-interview"  # URL slug (직접 지정)
seriesOrder: 1                          # 시리즈 내 순서
```

- `seriesSlug`가 single source of truth — 별도 매핑 객체 없음
- 세 필드 모두 optional — 없으면 일반 포스트로 취급
- `seriesOrder` 누락 시 `date` 기준 fallback 정렬
- `seriesOrder` 중복 시 빌드 경고 출력 + `date` 2차 정렬

---

## 2. 데이터 레이어

### 타입 (`src/lib/types.ts`)

```typescript
export interface PostMeta {
  // 기존 필드...
  series?: string
  seriesSlug?: string
  seriesOrder?: number
}

// 시리즈 패널에 필요한 최소 데이터만 포함
export interface SeriesPostEntry {
  slug: string
  title: string
  seriesOrder: number
}

export interface SeriesMeta {
  name: string
  slug: string
  posts: SeriesPostEntry[]  // seriesOrder 순 정렬, draft 제외
}
```

### 신규 함수 (`src/lib/posts.ts`)

```typescript
// 전체 시리즈 목록 반환
export function getAllSeries(): SeriesMeta[]

// slug로 시리즈 조회
export function getSeriesBySlug(slug: string): SeriesMeta | undefined
```

- `getAllSeries()`는 `getAllPosts()` 내부 호출 (SSG 빌드 타임 실행 — 성능 문제 없음)
- `seriesSlug` 누락 포스트는 빌드 타임 에러 throw (조기 감지)
- 반환 타입 `undefined` 사용 (`null` 아님)

---

## 3. UI 컴포넌트

### SeriesPanel (신규)

**위치:** `src/components/post/SeriesPanel.tsx`

- `<details>` / `<summary>` 네이티브 HTML 사용 → Server Component (no `use client`)
- 기본 닫힘 상태
- 현재 포스트 하이라이트, 나머지는 링크
- draft 포스트 숨김 (SeriesMeta.posts가 이미 draft 제외)

```
[시리즈 1/3편] 대규모 시스템 설계 스터디 ▼
  1. 1명에서 수백만 명까지  ← 현재 (하이라이트)
  2. 데이터베이스 설계
  3. 캐시 전략
```

**Props:**
```typescript
interface SeriesPanelProps {
  series: SeriesMeta
  currentSlug: string
}
```

### SeriesCard (신규)

**위치:** `src/components/series/SeriesCard.tsx`

- 시리즈 이름, 포스트 수, 최신 업데이트 날짜 표시
- `/series` 인덱스 페이지에서 사용

**Props:**
```typescript
interface SeriesCardProps {
  series: SeriesMeta
}
```

### PrevNextNav (수정 없음)

컴포넌트 자체는 변경하지 않는다.
시리즈 포스트일 때 `page.tsx`에서 prev/next를 시리즈 순서 기준으로 계산해서 전달.

```typescript
// src/app/posts/[slug]/page.tsx
const series = post.seriesSlug ? getSeriesBySlug(post.seriesSlug) : undefined
const seriesPosts = series?.posts ?? []
const idx = seriesPosts.findIndex(p => p.slug === slug)
const prev = idx > 0 ? seriesPosts[idx - 1] : globalPrev
const next = idx < seriesPosts.length - 1 ? seriesPosts[idx + 1] : globalNext
```

---

## 4. 페이지

### `/series/page.tsx` (신규)

- `getAllSeries()` 호출
- `SeriesCard` 그리드 렌더링

### `/series/[slug]/page.tsx` (신규)

- `getSeriesBySlug(slug)` 호출
- 시리즈 이름 + 포스트 순서 목록
- `generateStaticParams` 필수

---

## 5. 파일 변경 목록

| 파일 | 변경 유형 |
|------|-----------|
| `src/lib/types.ts` | 수정 — PostMeta 확장, SeriesPostEntry/SeriesMeta 추가 |
| `src/lib/posts.ts` | 수정 — series 파싱, getAllSeries/getSeriesBySlug 추가 |
| `src/components/post/SeriesPanel.tsx` | 신규 |
| `src/components/series/SeriesCard.tsx` | 신규 |
| `src/app/series/page.tsx` | 신규 |
| `src/app/series/[slug]/page.tsx` | 신규 |
| `src/app/posts/[slug]/page.tsx` | 수정 — SeriesPanel 렌더링, 시리즈 prev/next 계산 |
| `content/posts/2026-04-14-system-design-interview-01.mdx` | 수정 — seriesSlug 필드 추가 |

---

## 6. 엣지 케이스

| 케이스 | 처리 방식 |
|--------|-----------|
| seriesOrder 없음 | 시리즈에서 제외 + console.warn (의도적 변경: fallback 정렬 대신 제외 — 시리즈 번호 불안정 방지, ecc:architect 리뷰 반영) |
| seriesOrder 중복 | 경고 로그 + date 2차 정렬 |
| seriesSlug 누락 (series는 있음) | 빌드 타임 에러 throw |
| 시리즈 포스트가 1개뿐 | SeriesPanel은 표시하되 prev/next 시리즈 네비 숨김 |
| draft 포스트 | SeriesPanel 목록에서 숨김 |
