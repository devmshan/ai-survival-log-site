# Analytics & View Count 기능 설계

**Date:** 2026-04-10
**Status:** Approved
**Topic:** 도메인 방문자 추적 + 게시글 조회수 표시

---

## 목표

1. **도메인 방문자 수** (Total / Today / Yesterday) 를 사이트 Footer에 공개 표시
2. **게시글 조회수** 를 홈 게시글 카드에 공개 표시

---

## 스택

- **저장소:** Vercel KV (Redis) — `@vercel/kv` 패키지
- **배포:** Vercel (기존)
- **렌더링:** Next.js 16 App Router, Client Components for live data

---

## 아키텍처

### 도메인 방문자 추적

```
사용자 페이지 방문 (any page)
  → VisitorTracker (Client Component, layout.tsx에 삽입)
    → useEffect → POST /api/visitors
      → KV INCR "visitors:total"
      → KV INCR "visitors:YYYY-MM-DD"  (오늘 날짜)

Footer 렌더
  → VisitorStats (Client Component)
    → GET /api/visitors
      → { total, today, yesterday }
      → Display: Total Visitors | Today's Visitors | Yesterday's Visitors
```

**KV 키 구조:**
| 키 | 설명 |
|----|------|
| `visitors:total` | 전체 누적 방문자 수 |
| `visitors:YYYY-MM-DD` | 해당 날짜 방문자 수 (UTC 기준) |

### 게시글 조회수

```
사용자가 /posts/[slug] 진입
  → ViewTracker (Client Component)
    → useEffect → POST /api/views/[slug]
      → KV INCR "views:{slug}"

홈 카드 렌더
  → ViewCount (Client Component)
    → GET /api/views/{slug}
      → KV GET "views:{slug}"
      → Display: 👁 123
```

**KV 키 구조:**
| 키 | 설명 |
|----|------|
| `views:{slug}` | 해당 포스트 조회수 |

---

## API 설계

### `GET /api/visitors`

응답:
```json
{
  "success": true,
  "data": {
    "total": 1234,
    "today": 42,
    "yesterday": 87
  }
}
```

### `POST /api/visitors`

요청: body 없음
동작: `visitors:total` + `visitors:YYYY-MM-DD` 원자적 증가
응답:
```json
{ "success": true }
```

### `GET /api/views/[slug]`

응답:
```json
{
  "success": true,
  "data": { "views": 321 }
}
```

### `POST /api/views/[slug]`

요청: body 없음
동작: `views:{slug}` 원자적 증가
응답:
```json
{ "success": true }
```

---

## 컴포넌트 설계

### VisitorTracker (`src/components/analytics/VisitorTracker.tsx`)

- `"use client"`
- `useEffect`에서 `POST /api/visitors` 호출 (마운트 시 1회)
- UI 없음 (invisible tracker)

### VisitorStats (`src/components/analytics/VisitorStats.tsx`)

- `"use client"`
- 마운트 시 `GET /api/visitors` fetch
- 로딩 중: `—` 표시 (skeleton 없이 단순 처리)
- 표시 형식:

```
Total Visitors: 1,234 | Today's Visitors: 42 | Yesterday's Visitors: 87
```

### ViewTracker (`src/components/post/ViewTracker.tsx`)

- `"use client"`
- `useEffect`에서 `POST /api/views/[slug]` 호출 (마운트 시 1회)
- UI 없음

### ViewCount (`src/components/post/ViewCount.tsx`)

- `"use client"`
- 마운트 시 `GET /api/views/{slug}` fetch
- 로딩 중: `—` 표시
- 표시 형식: `👁 123` (PostCard 하단 날짜/읽기시간 옆)

---

## 수정 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/app/api/visitors/route.ts` | 신규: GET + POST |
| `src/app/api/views/[slug]/route.ts` | 신규: GET + POST |
| `src/components/analytics/VisitorTracker.tsx` | 신규 |
| `src/components/analytics/VisitorStats.tsx` | 신규 |
| `src/components/post/ViewTracker.tsx` | 신규 |
| `src/components/post/ViewCount.tsx` | 신규 |
| `src/app/layout.tsx` | VisitorTracker 추가 |
| `src/components/layout/Footer.tsx` | VisitorStats 추가 |
| `src/components/post/PostCard.tsx` | ViewCount 추가 |
| `src/app/posts/[slug]/page.tsx` | ViewTracker 추가 |

---

## 에러 처리

- KV 연결 실패 시 API는 `{ success: false, error: "..." }` 반환
- 클라이언트 컴포넌트는 fetch 실패 시 `—` 유지 (사용자에게 에러 노출 없음)
- `views:{slug}` 키가 없으면 `0` 반환

---

## 테스트 계획

- API route 유닛 테스트 (KV mock)
  - GET /api/visitors: 정상 응답, KV 오류 시 에러 응답
  - POST /api/visitors: INCR 호출 확인
  - GET /api/views/[slug]: 정상 응답, 키 없을 때 0 반환
  - POST /api/views/[slug]: INCR 호출 확인
- 컴포넌트 테스트
  - ViewCount: 로딩 상태, 숫자 표시
  - VisitorStats: 로딩 상태, 숫자 표시

---

## 설정 요구사항

Vercel 대시보드에서:
1. Storage → KV 생성
2. 프로젝트에 연결 (환경변수 자동 주입: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` 등)
3. 로컬 개발: `vercel env pull .env.local` 로 환경변수 다운로드
