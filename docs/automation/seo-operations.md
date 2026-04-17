# SEO Operations

## 목적

이 문서는 `ai-survival-log-site`의 검색 노출 운영 기준을 정리한다.

범위:

- 기술 SEO 배포 전 점검
- 검색엔진 제출 체크리스트
- 운영 중 추적할 핵심 지표
- 콘텐츠 작성 시 적용할 최소 SEO 원칙

새 글 작성과 기존 글 리라이트의 상세 기준은
[docs/content-seo-guide.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/content-seo-guide.md)
를 따른다.

이 문서의 직접 대상은 site repo다.
다만 `content/posts` frontmatter나 publish output shape와 관련된 변경은 upstream `ai-survival-log` publish contract와 호환되어야 한다.
또한 콘텐츠 SEO 작성 원칙은 downstream 보정 규칙으로만 남기지 말고, 가능하면 upstream `ai-survival-log`의 글 작성 흐름에도 동일하게 반영해야 한다.

---

## 현재 SEO 기반

현재 site runtime에는 아래가 반영되어 있다.

- 전역 `metadataBase`
- 홈/소개/태그/시리즈/포스트 canonical
- `robots.txt`
- `sitemap.xml`
- 포스트 상세 Open Graph / Twitter metadata
- 포스트 상세 `BlogPosting` JSON-LD
- optional SEO frontmatter fallback:
  - `seoTitle`
  - `seoDescription`
  - `thumbnail`

관련 코드:

- [src/app/layout.tsx](/Users/ms/workspace/claude/ai-survival-log-site/src/app/layout.tsx)
- [src/app/robots.ts](/Users/ms/workspace/claude/ai-survival-log-site/src/app/robots.ts)
- [src/app/sitemap.ts](/Users/ms/workspace/claude/ai-survival-log-site/src/app/sitemap.ts)
- [src/app/posts/[slug]/page.tsx](/Users/ms/workspace/claude/ai-survival-log-site/src/app/posts/%5Bslug%5D/page.tsx)
- [docs/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/content-contract.md)

---

## 배포 전 체크리스트

- [ ] `NEXT_PUBLIC_SITE_URL` 또는 `SITE_URL`가 실제 배포 도메인을 가리키는지 확인
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `node scripts/verify-content-contract.mjs --all`
- [ ] `npm run build`
- [ ] `/robots.txt` 생성 확인
- [ ] `/sitemap.xml` 생성 확인
- [ ] 대표 포스트 1개 이상에서 canonical 확인
- [ ] 대표 포스트 1개 이상에서 OG/Twitter metadata 확인
- [ ] 대표 포스트 1개 이상에서 `application/ld+json` 확인

권장 수동 확인 페이지:

- `/`
- `/about`
- `/series`
- `/posts/<대표 slug>`
- `/tags/<대표 tag>`

---

## 검색엔진 제출 체크리스트

### Google Search Console

- [ ] 사이트 속성 등록
- [ ] 기본 도메인 확인
- [ ] `sitemap.xml` 제출
- [ ] 대표 포스트 URL 1~2개 수동 검사
- [ ] 색인 제외 사유 확인

### Bing Webmaster

- [ ] 사이트 등록
- [ ] `sitemap.xml` 제출
- [ ] 크롤링 오류 확인

### 네이버 서치어드바이저

- [ ] 사이트 등록
- [ ] 사이트맵 제출
- [ ] 수집/색인 상태 확인

운영 원칙:

- 제출은 배포 후 한 번으로 끝내지 않는다
- 새 구조를 추가한 뒤에는 sitemap 재확인과 대표 URL 재검사를 한다
- 색인 누락은 “글 품질”보다 먼저 기술 설정과 canonical 충돌 여부를 확인한다

---

## 핵심 지표

매주 또는 격주로 아래를 본다.

- 색인된 URL 수
- 총 노출수
- 총 클릭수
- 평균 CTR
- 평균순위
- 노출은 높은데 CTR이 낮은 글
- 색인 제외가 반복되는 URL 패턴

우선 해석 규칙:

- 노출이 거의 없으면:
  - 색인 상태
  - sitemap 반영 여부
  - 내부 링크 부족
  - 제목/설명과 질의 불일치

- 노출은 있는데 CTR이 낮으면:
  - `seoTitle`/`seoDescription`
  - 대표 이미지
  - 검색 의도와 제목 불일치
  - 너무 감성적인 제목

- 특정 토픽만 약하면:
  - 토픽 클러스터 부재
  - 관련 글 내부 링크 부족
  - 시리즈/태그 진입 구조 부족

---

## 콘텐츠 작성 체크리스트

새 글 작성 시 최소한 아래를 점검한다.

- [ ] 제목이 검색 질의를 직접 받는가
- [ ] 첫 2~3문단 안에 “이 글이 무엇을 설명하는지”가 명확한가
- [ ] `description`이 요약 역할을 하는가
- [ ] 필요 시 `seoTitle`, `seoDescription`를 별도로 넣었는가
- [ ] `thumbnail`을 지정했는가
- [ ] 관련 기존 글 2개 이상과 내부 링크 연결이 가능한가
- [ ] 시리즈로 묶을 수 있는 글이면 `series`, `seriesSlug`, `seriesOrder`를 검토했는가

권장 원칙:

- 감성형 제목만 단독으로 쓰지 않는다
- 가능하면 핵심 개념어를 제목 또는 부제 역할의 문장에 포함한다
- 검색 유입을 노리는 글은 한 문서 안에서 질문과 답이 빠르게 맞물리게 쓴다

---

## 토픽 클러스터 운영 메모

현재 우선 후보:

- LLM 기초
- 임베딩 / Vector DB / RAG
- 시스템 설계 스터디
- AI coding workflow / automation

운영 방식:

- 각 토픽마다 진입 글 1개를 둔다
- 세부 글은 진입 글과 서로 링크한다
- 시리즈 페이지를 만들 수 있으면 시리즈로 묶는다
- 태그만으로 끝내지 말고, 글 본문/하단에서도 관련 글 이동이 가능해야 한다

---

## 장애/이상 징후 체크

아래 중 하나가 보이면 기술 SEO부터 다시 본다.

- 배포 후 특정 글만 검색결과에서 사라짐
- canonical이 의도와 다르게 한 URL로 수렴함
- sitemap에 새 글이 계속 안 들어감
- 대표 이미지가 공유 미리보기에서 빠짐
- Search Console에서 중복 페이지 경고가 반복됨

우선 확인 파일:

- [src/app/layout.tsx](/Users/ms/workspace/claude/ai-survival-log-site/src/app/layout.tsx)
- [src/app/sitemap.ts](/Users/ms/workspace/claude/ai-survival-log-site/src/app/sitemap.ts)
- [src/app/robots.ts](/Users/ms/workspace/claude/ai-survival-log-site/src/app/robots.ts)
- [src/app/posts/[slug]/page.tsx](/Users/ms/workspace/claude/ai-survival-log-site/src/app/posts/%5Bslug%5D/page.tsx)
- [src/lib/site.ts](/Users/ms/workspace/claude/ai-survival-log-site/src/lib/site.ts)

---

## Verify

이 문서를 바꿨을 때도 아래 원칙은 유지한다.

- 운영 문서와 runtime 동작이 서로 모순되지 않아야 한다
- `content/posts` contract 변경이 있으면 [docs/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/content-contract.md) 와 함께 갱신한다
- upstream publish 산출물이 optional SEO 필드를 아직 주지 않아도 site는 fallback으로 계속 동작해야 한다
