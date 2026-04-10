# 테스트 결과 문서

## 실행 환경

| 항목 | 버전 |
|------|------|
| Vitest | v4.1.4 |
| @testing-library/react | v16.3.x |
| @testing-library/user-event | v14.6.x |
| 환경 | jsdom |

## 최근 실행 결과 (2026-04-10)

```
Test Files  4 passed (4)
     Tests  27 passed (27)
  Duration  ~2.2s
```

## 테스트 파일 목록

### `src/lib/__tests__/posts.test.ts` — 9개

| 테스트 | 설명 |
|--------|------|
| draft 포스트를 제외하고 반환한다 | `draft: true` 필터링 확인 |
| 날짜 내림차순으로 정렬한다 | `toSorted()` 정렬 순서 확인 |
| slug가 파일명에서 확장자를 제거한 값이다 | 파일명 파싱 |
| readingTime 필드가 포함된다 | 메타데이터 생성 |
| .md 확장자도 처리한다 | mdx 외 확장자 지원 |
| slug에 해당하는 포스트를 반환한다 | 단일 포스트 조회 |
| 존재하지 않는 slug면 에러를 던진다 | 404 에러 처리 |
| 중복 없이 정렬된 태그 목록을 반환한다 | Set 기반 중복 제거 |
| 태그가 일치하는 포스트만 반환한다 / 없으면 빈 배열 | 태그 필터링 |

### `src/lib/__tests__/search.test.ts` — 5개

| 테스트 | 설명 |
|--------|------|
| 제목으로 검색하면 일치하는 결과를 반환한다 | title 가중치 0.6 |
| 설명으로 검색하면 일치하는 결과를 반환한다 | description 가중치 0.3 |
| 태그로 검색하면 일치하는 결과를 반환한다 | tags 가중치 0.1 |
| 일치하는 결과가 없으면 빈 배열을 반환한다 | 빈 결과 처리 |
| 빈 포스트 목록으로 인덱스를 생성할 수 있다 | 엣지 케이스 |

### `src/app/api/newsletter/__tests__/route.test.ts` — 7개

| 테스트 | 기대 상태코드 |
|--------|-------------|
| 유효한 이메일이면 성공한다 | 200 |
| 이메일이 없으면 실패한다 | 400 |
| @가 없는 이메일이면 실패한다 | 400 |
| 잘못된 JSON body면 실패한다 | 400 |
| RESEND_API_KEY가 없으면 실패한다 | 503 |
| RESEND_SEGMENT_ID가 없으면 실패한다 | 503 |
| Resend API 오류 시 실패한다 | 500 |

### `src/components/newsletter/__tests__/NewsletterForm.test.tsx` — 5개

| 테스트 | 설명 |
|--------|------|
| 이메일 입력창과 구독 버튼이 렌더링된다 | 초기 렌더링 |
| 구독 성공 시 감사 메시지를 표시한다 | 성공 상태 UI |
| 구독 실패 시 에러 메시지를 표시한다 | 에러 상태 UI |
| 제출 중에는 버튼이 비활성화된다 | 로딩 상태 UI |
| 올바른 payload로 API를 호출한다 | fetch 호출 검증 |

## 커버리지 현황

```
File               | % Stmts | % Branch | % Funcs | % Lines
-------------------|---------|----------|---------|--------
src/lib/posts.ts   |   100   |   61.53  |   100   |   100
src/lib/search.ts  |   100   |   100    |   100   |   100
newsletter/route.ts|   100   |   100    |   100   |   100
NewsletterForm.tsx |   100   |   100    |   100   |   100
-------------------|---------|----------|---------|--------
미테스트 컴포넌트   |     0   |     0    |     0   |     0
전체 평균           |   38.75 |   32.98  |   31.37 |  38.66
```

> **참고:** 전체 평균이 낮은 이유는 UI 컴포넌트(Header, Footer, PostCard 등)에 테스트가 없기 때문입니다.
> 핵심 비즈니스 로직(`lib/`, `api/`) 및 뉴스레터 폼은 100% 커버됩니다.

## 미커버 영역 (향후 과제)

| 파일 | 우선순위 | 이유 |
|------|---------|------|
| `components/post/TableOfContents.tsx` | 높음 | DOM 파싱 로직 포함 |
| `components/search/SearchBar.tsx` | 높음 | 키보드 핸들러 + 검색 플로우 |
| `components/post/TagFilter.tsx` | 중간 | URL 쿼리 파라미터 연동 |
| `components/layout/Header.tsx` | 낮음 | 테마 토글, 검색 트리거 |
| `components/post/PostCard.tsx` | 낮음 | 렌더링만 |

## 테스트 실행 명령어

```bash
npm test              # 단일 실행
npm run test:watch    # watch 모드
npm run test:coverage # 커버리지 포함
```
