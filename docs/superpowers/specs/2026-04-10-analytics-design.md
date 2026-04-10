# Analytics & View Count 기능 설계

**Date:** 2026-04-10
**Status:** Approved
**Topic:** 게시글 조회수 표시 + 도메인 방문자 내부 추적

---

## 목표

1. **게시글 조회수** 를 홈 게시글 카드에 공개 표시 (`👁 123`)
2. **도메인 방문자 수** 는 Vercel Analytics 대시보드에서 내부 확인 (사이트에 미표시)

> 개인 블로그에서 방문자 수 공개 표시는 초반 낮은 숫자로 역효과가 날 수 있고
> 올드한 느낌을 줄 수 있어 제외. 게시글 조회수만 독자에게 유용한 정보로 노출.

---

## 스택

- **저장소:** Vercel KV (Redis) — `@vercel/kv` 패키지
- **도메인 방문자:** Vercel Analytics (대시보드 전용, 코드 1줄)
- **배포:** Vercel (기존)
- **렌더링:** Next.js 16 App Router, Client Components for live data

---

## 아키텍처

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

### 도메인 방문자 (Vercel Analytics)

- `@vercel/analytics` 패키지 설치
- `layout.tsx`에 `<Analytics />` 추가 (1줄)
- Vercel 대시보드 → Analytics 탭에서 일일/전체 방문자 확인

---

## API 설계

### `GET /api/views/[slug]`

응답:
```json
{
  "success": true,
  "data": { "views": 321 }
}
```

- `views:{slug}` 키가 없으면 `views: 0` 반환

### `POST /api/views/[slug]`

요청: body 없음
동작: `views:{slug}` 원자적 증가 (KV INCR)
응답:
```json
{ "success": true }
```

---

## 컴포넌트 설계

### ViewTracker (`src/components/post/ViewTracker.tsx`)

- `"use client"`
- `useEffect`에서 `POST /api/views/[slug]` 호출 (마운트 시 1회)
- UI 없음 (invisible tracker)

### ViewCount (`src/components/post/ViewCount.tsx`)

- `"use client"`
- 마운트 시 `GET /api/views/{slug}` fetch
- 로딩 중: `—` 표시
- 표시 형식: `👁 123` (PostCard 하단 날짜/읽기시간 옆)

---

## 수정 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/app/api/views/[slug]/route.ts` | 신규: GET + POST |
| `src/components/post/ViewTracker.tsx` | 신규: 조회수 증가 Client Component |
| `src/components/post/ViewCount.tsx` | 신규: 조회수 표시 Client Component |
| `src/app/layout.tsx` | `<Analytics />` 추가 (Vercel Analytics) |
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
  - `GET /api/views/[slug]`: 정상 응답, 키 없을 때 `0` 반환, KV 오류 시 에러 응답
  - `POST /api/views/[slug]`: INCR 호출 확인
- 컴포넌트 테스트
  - `ViewCount`: 로딩 상태(`—`), 숫자 표시, fetch 실패 시 `—` 유지

---

## 설정 요구사항

**Vercel 대시보드:**
1. Storage → KV 생성 및 프로젝트 연결
   - 환경변수 자동 주입: `KV_REST_API_URL`, `KV_REST_API_TOKEN`
2. Analytics → Enable

**로컬 개발:**
```bash
vercel env pull .env.local
```
