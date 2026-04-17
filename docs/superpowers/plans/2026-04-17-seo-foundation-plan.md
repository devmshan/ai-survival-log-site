# SEO Foundation Plan

> This repository adopts only the useful operating principles from ECC and superpowers. Use `plan -> implement -> verify`, but do not import a large external agent pack or workflow surface.

**Goal:** 검색엔진이 `ai-survival-log-site`의 홈, 포스트, 태그, 시리즈 페이지를 안정적으로 발견하고 이해할 수 있도록 기술 SEO 기반을 정비하고, 이후 콘텐츠/배포 운영까지 이어지는 실행 순서를 고정한다.

**Architecture:** Next.js 16 App Router의 metadata/file-based metadata 관례를 사용해 전역 메타데이터, canonical, `robots.txt`, `sitemap.xml`, 포스트별 Open Graph/Twitter 메타, `BlogPosting` 구조화 데이터를 추가한다. 이후 `content/posts` frontmatter 계약을 확장해 SEO용 필드를 안정적으로 수용하고, 시리즈/내부 링크 구조를 검색 유입 관점으로 보강한다.

**Tech Stack:** Next.js 16 App Router, TypeScript, MDX content pipeline, Vitest, existing `content/posts` publishing contract

---

## 배경

현재 확인된 상태:

- `src/app/layout.tsx`는 기본 `title`, `description`만 설정
- `src/app/posts/[slug]/page.tsx`는 글별 `title`, `description`만 설정
- `metadataBase`, canonical, `robots`, `sitemap`, OG/Twitter, JSON-LD 부재
- `content/posts` 계약에는 최소 frontmatter만 정의되어 있고 SEO 전용 필드는 아직 없음

이 상태에서는 검색엔진이 다음을 충분히 판단하기 어렵다.

- 이 사이트의 기준 URL이 무엇인지
- 어떤 페이지를 크롤링/색인해야 하는지
- 각 글이 블로그 글인지, 어떤 제목/설명/대표 이미지를 가지는지
- 시리즈와 태그 페이지가 어떤 역할의 문서인지

이 계획의 직접 구현 대상은 `ai-survival-log-site`다. 다만 `ai-survival-log`는 upstream publish source로서 계속 고려해야 하는 제약 조건이다. 특히 `content/posts` frontmatter나 publish output shape에 영향을 주는 변경은 upstream publish contract와 충돌하면 안 된다.

---

## 범위

### 포함

- 전역 metadata 정비
- 포스트/태그/시리즈 페이지 canonical 및 메타 정비
- `robots.ts`, `sitemap.ts` 추가
- 포스트 상세 `openGraph`, `twitter`, `alternates` 추가
- 포스트 상세 `BlogPosting` JSON-LD 추가
- SEO용 frontmatter 계약 확장 검토
- 내부 링크/시리즈 구조 개선 방향 정의
- Search Console/Webmaster 제출용 운영 체크리스트 정의

### 제외

- 외부 백링크 확보 실행
- SNS/커뮤니티 재배포 자동화 구현
- 대규모 에이전트팩, ECC skill-pack, full superpowers workflow import
- upstream wiki 저장소의 발행 규칙 직접 변경

### Cross-Repo Constraint

- 구현은 `ai-survival-log-site`에서 진행한다
- `ai-survival-log`는 변경 대상이 아니라 publish contract 검토 대상으로 본다
- frontmatter 또는 publish output shape를 건드리는 변경은 upstream와의 호환성을 유지해야 한다
- contract 관련 변경 시 두 repo의 운영 문서와 publish 흐름 설명을 함께 재확인한다

---

## 파일 후보

| 파일 | 역할 |
|------|------|
| `src/app/layout.tsx` | 전역 metadata, `metadataBase`, 기본 OG/Twitter |
| `src/app/page.tsx` | 홈 메타 보강 필요 여부 검토 |
| `src/app/posts/[slug]/page.tsx` | 포스트별 metadata 확장, JSON-LD 삽입 |
| `src/app/tags/[tag]/page.tsx` | 태그 페이지 metadata 확장 |
| `src/app/series/[slug]/page.tsx` | 시리즈 페이지 metadata 확장 |
| `src/app/robots.ts` | robots metadata route 추가 |
| `src/app/sitemap.ts` | sitemap metadata route 추가 |
| `src/lib/posts.ts` | SEO용 frontmatter 파싱이 필요하면 확장 |
| `src/lib/types.ts` | optional SEO 필드가 필요하면 확장 |
| `docs/content-contract.md` | frontmatter 계약 변경 시 동기화 |
| `docs/automation/` 또는 `docs/` | 운영 체크리스트 문서 추가 필요 시 |

---

## Phase 1: 기술 SEO 기반 정비

목표: 검색엔진이 사이트 구조와 대표 URL을 안정적으로 이해할 수 있게 한다.

- [ ] `metadataBase`를 루트 layout에 추가한다
- [ ] 기본 canonical 전략을 정한다
- [ ] 전역 Open Graph/Twitter 기본값을 정한다
- [ ] `src/app/robots.ts`를 추가한다
- [ ] `src/app/sitemap.ts`를 추가한다
- [ ] 홈/포스트/태그/시리즈의 절대 URL 생성 규칙을 정한다

완료 기준:

- 홈, 포스트, 태그, 시리즈 페이지가 절대 URL 기준 메타를 가진다
- `/robots.txt`, `/sitemap.xml`이 생성된다
- 대표 사이트 URL이 코드상 한 곳에서 관리된다

검증:

- `npm run build`
- 빌드 결과에서 metadata routes 생성 확인
- 생성 HTML/메타 출력 수동 확인

---

## Phase 2: 포스트 상세 SEO 확장

목표: 각 글이 검색결과와 외부 공유 환경에서 더 명확하게 해석되게 한다.

- [ ] `generateMetadata`에 `alternates.canonical` 추가
- [ ] `openGraph`에 title, description, type, url, publishedTime, tags, images 반영
- [ ] `twitter` metadata 추가
- [ ] 대표 이미지 전략을 정한다
- [ ] 포스트 상세에 `BlogPosting` JSON-LD를 삽입한다

완료 기준:

- 각 포스트가 고유 canonical을 가진다
- 각 포스트가 SNS/메신저 공유용 메타를 가진다
- 각 포스트 본문 페이지에 구조화 데이터가 포함된다

검증:

- 샘플 포스트 2개 이상에서 metadata 결과 확인
- 대표 이미지 없는 글의 fallback 동작 확인
- `npm run build`

---

## Phase 3: 콘텐츠 계약 확장

목표: publish pipeline 호환성을 유지하면서 SEO용 필드를 안전하게 수용한다.

- [ ] 현재 `thumbnail` 필드 재사용 범위를 먼저 검토한다
- [ ] 필요 시 `seoTitle`, `seoDescription` 같은 optional 필드 도입 여부를 결정한다
- [ ] runtime 파서와 타입을 계약과 일치시킨다
- [ ] `docs/content-contract.md`를 갱신한다

원칙:

- 수동 작성 포스트와 upstream publish 산출물 모두 호환되어야 한다
- 최소 contract를 불필요하게 무겁게 만들지 않는다
- 기본값으로도 동작해야 하고, 추가 필드는 선택 사항이어야 한다
- `ai-survival-log`가 새 필드를 즉시 생산하지 않더라도 site runtime이 안전하게 fallback 해야 한다

완료 기준:

- SEO 필드 운영 방식이 문서와 runtime에서 일치한다
- 기존 포스트가 추가 마이그레이션 없이 계속 동작한다
- upstream publish 결과물과의 호환성 가정이 문서에 명시된다

검증:

- `src/lib/__tests__/posts.test.ts` 영향 범위 확인
- content contract 검증 스크립트가 있으면 함께 실행
- `npm test`

---

## Phase 4: 정보구조 및 내부 링크 강화

목표: 단일 글 노출이 아니라 주제 단위 검색 유입으로 확장한다.

- [ ] 우선 공략할 토픽 클러스터를 정한다
- [ ] 시리즈 페이지를 검색 진입 페이지로 활용할지 결정한다
- [ ] 관련 글/다음 글/시리즈 링크 전략을 정한다
- [ ] 글 도입부와 제목이 검색 의도를 직접 받도록 편집 원칙을 정한다

후보 토픽 예시:

- LLM 기초
- 임베딩 / Vector DB / RAG
- 시스템 설계 스터디
- AI coding workflow / automation

완료 기준:

- 주요 토픽별 진입 글과 연결 글 구조가 정의된다
- 새 글 작성 시 내부 링크 원칙이 적용 가능하다

검증:

- 대표 토픽 1개를 샘플로 연결 구조 검토
- 관련 글/시리즈 탐색 흐름 수동 확인

---

## Phase 5: 제출 및 계측 운영

목표: SEO를 감이 아니라 색인/노출 데이터로 운영한다.

- [ ] Google Search Console 제출 체크리스트 작성
- [ ] Bing Webmaster 제출 체크리스트 작성
- [ ] 네이버 서치어드바이저 제출 체크리스트 작성
- [ ] 추적할 핵심 지표를 정한다

핵심 지표:

- 색인된 URL 수
- 노출수
- 클릭수
- CTR
- 평균순위
- 노출은 있으나 CTR이 낮은 글 목록

완료 기준:

- 배포 후 제출해야 할 운영 절차가 문서화된다
- 이후 개선 우선순위를 데이터로 정할 수 있다

---

## 구현 순서

1. Phase 1 기술 SEO 기반 정비
2. Phase 2 포스트 상세 SEO 확장
3. Phase 3 콘텐츠 계약 확장
4. Phase 4 정보구조 및 내부 링크 강화
5. Phase 5 제출 및 계측 운영

이 순서를 따르는 이유:

- 기술 SEO가 먼저 정리되지 않으면 검색엔진이 페이지를 제대로 이해하지 못한다
- 콘텐츠 계약을 먼저 바꾸기보다 runtime 메타 기반부터 안정화하는 편이 리스크가 낮다
- 내부 링크와 콘텐츠 편집 전략은 기술 기반이 올라간 후 적용하는 편이 측정이 쉽다

---

## 리스크 및 주의사항

- site URL을 환경변수로 둘지 상수로 둘지 결정이 필요하다
- 대표 이미지 전략이 없으면 OG/Twitter 품질이 반쪽짜리가 될 수 있다
- frontmatter 필드 확장은 upstream publish contract와 충돌하면 안 된다
- site 쪽에서만 계약을 확장하면 upstream publish 단계에서 필드 유실 또는 미생성 상태가 생길 수 있다
- 태그/시리즈 페이지에 과도한 색인 페이지를 만들지 않도록 canonical/설명 전략을 함께 봐야 한다

---

## Verify Checklist

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] metadata route 출력 확인 (`robots`, `sitemap`)
- [ ] 샘플 포스트 페이지 메타 확인
- [ ] 구조화 데이터 삽입 확인
- [ ] `docs/content-contract.md`와 runtime 정합성 확인
- [ ] upstream/downstream publish contract 충돌 여부 점검

---

## Immediate Next Step

이 계획의 첫 구현 범위는 아래 5개로 고정한다.

1. 전역 `metadataBase`와 canonical 전략 추가
2. `src/app/robots.ts`, `src/app/sitemap.ts` 추가
3. 포스트 상세 metadata에 OG/Twitter/alternates 추가
4. 포스트 상세에 `BlogPosting` JSON-LD 추가
5. SEO용 frontmatter 운영 방식 문서화
