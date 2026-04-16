# AI Automation Lab Plan for `ai-survival-log-site`

**Goal:** `ai-survival-log-site`를 실습 대상으로 삼아, 회사에서 바로 응용 가능한 자동화 프로젝트 10개를 순서대로 구현하고 검증하는 학습 로드맵을 만든다.

**Scope:** 이 문서는 구현이 아니라 상세 실습 계획이다. 각 실습은 작은 수직 슬라이스로 끝내고, 다음 실습이 이전 산출물을 재사용하도록 설계한다.

**Project Baseline:**
- Frontend/App: Next.js 16 App Router + React 19 + TypeScript
- Content: `content/posts/*.mdx`
- Tests: Vitest + Testing Library
- Existing API routes:
  - `src/app/api/views/[slug]/route.ts`
  - `src/app/api/newsletter/route.ts`
- Existing verification:
  - `npm run lint`
  - `npm test`
  - `npm run build`

**Planning Principles:**
- 먼저 내부 데이터와 로컬 흐름만으로 끝나는 자동화부터 한다.
- 그다음 GitHub/CI에 붙인다.
- 외부 서비스(Jira, Sentry, Langfuse 등)는 마지막에 넣는다.
- 모든 실습은 "사람 시간을 얼마나 줄였는가"를 기준으로 평가한다.

## Current Status

- `1. PR 요약 + 리뷰 포인트 생성기` — 완료
- `2. Jira 이슈 구현 계획 초안 생성기` — 진행 예정
- 현재는 PR summary 실습 결과를 다시 공부하는 단계라 구현을 잠시 멈춤

---

## 0. 준비 단계

### 목표

이후 10개 실습이 안정적으로 돌아가도록 최소 실행 기반을 만든다.

### 선행 확인

- `npm install`
- `npm run lint`
- `npm test`
- `npm run build`
- GitHub Actions 사용 가능 여부
- 저장소 secrets 등록 가능 여부

### 먼저 정리할 항목

- `.github/workflows/` 유무와 현재 CI 상태 확인
- 테스트 결과 산출물(`test-results/`) 활용 방식 확인
- content contract 검증 스크립트와 CI 연결 여부 확인
- 로컬/CI 공용 환경 변수 목록 정리

### 준비 산출물

- `docs/automation/` 또는 `docs/superpowers/specs/` 아래 자동화 설계 메모 시작
- `.github/workflows/ci.yml` 또는 기존 워크플로우 점검 결과
- 공통 프롬프트/운영 규칙 문서 초안

### 완료 기준

- 사이트가 로컬에서 재현 가능
- 테스트/빌드 기준선이 명확
- 이후 자동화를 붙일 이벤트 지점(PR, push, issue, deploy)이 식별됨

---

## 전체 실습 순서

1. PR 요약 + 리뷰 포인트 생성기
2. Jira 이슈 구현 계획 초안 생성기
3. 회귀 테스트 실행 + 실패 원인 정리 봇
4. 장애 1차 분석 봇
5. API 문서와 런북 자동 갱신기
6. 반복 운영 쿼리 생성기
7. 배포 체크리스트 자동 수행 에이전트
8. 오픈소스 이슈 대응 보조 워크플로우
9. 경쟁사/기술 동향 모니터링 스크래퍼
10. 사내 백오피스 반복 작업 자동화

이 순서는 의도적으로 다음 흐름을 따른다.
- `코드 리뷰 자동화`
- `구현 전 정리 자동화`
- `검증 자동화`
- `운영 분석 자동화`
- `문서화 자동화`
- `운영 실행 자동화`

---

## 1. PR 요약 + 리뷰 포인트 생성기

상태: `완료`

### 왜 1번인가

도입 난도가 가장 낮고, `ai-survival-log-site`의 현재 구조와 가장 잘 맞는다. 이미 lint/test/build가 있어서 AI가 해석할 재료가 충분하다.

### 목표

PR이 열리거나 업데이트될 때 AI가 다음을 자동 생성한다.
- 변경 요약
- 리뷰 포인트
- 테스트 영향 범위
- 위험도 체크리스트

### 구현 범위

- GitHub Action 트리거: `pull_request`
- changed files 수집
- diff 또는 파일 목록을 AI 입력으로 요약
- PR 코멘트 또는 체크 결과로 게시

### 추천 1차 구현

외부 AI API 없이 먼저 deterministic 버전으로 시작:
- 변경 파일 분류
- 테스트 파일 존재 여부
- `content/posts` 변경인지 `src/` 변경인지 구분
- 위험도 규칙 기반 체크

그 다음 2차에서 LLM 요약 추가:
- "이 PR은 UI 수정 / 데이터 로딩 수정 / 콘텐츠 수정" 같은 자연어 코멘트 생성

### 대상 파일 후보

- `.github/workflows/pr-summary.yml`
- `scripts/` 아래 PR 분석 스크립트
- `docs/automation/pr-summary.md`

### 검증

- 샘플 PR에서 자동 코멘트 생성
- false positive/false negative 기록
- 사람이 수동으로 쓰던 PR 설명 시간을 얼마나 줄였는지 측정

### 완료 기준

- PR마다 일관된 요약이 생성됨
- 리뷰어가 "어디를 먼저 봐야 하는지" 바로 알 수 있음

---

## 2. Jira 이슈 구현 계획 초안 생성기

상태: `진행 예정`

### 왜 2번인가

실무에서 체감이 크지만, 실제 Jira 연동 전에 로컬 문서 기반으로 충분히 실습할 수 있다.

### 목표

티켓 설명을 입력하면 AI가 구현 계획 초안을 만든다.
- 목표
- 변경 파일 후보
- 테스트 계획
- 확인 질문

### 1차 실습 방식

Jira 없이 local markdown issue template로 시작:
- `docs/automation/intake/*.md`
- 또는 GitHub issue body를 입력 소스로 사용

### 2차 확장

- Jira API 또는 MCP 연결
- 이슈 본문을 자동으로 읽어 계획 초안 코멘트 생성

### 산출물

- 구현 계획 템플릿
- 이슈 -> 계획 변환 프롬프트
- 샘플 티켓 3개

### 검증

- 동일 티켓에 대해 사람이 짠 초안과 비교
- 빠진 테스트 포인트 수집

### 완료 기준

- 모호한 티켓을 개발 시작 가능한 수준으로 구조화할 수 있음

---

## 3. 회귀 테스트 실행 + 실패 원인 정리 봇

### 왜 3번인가

이 저장소는 이미 테스트 기반이 있으므로, 자동화 성과를 가장 빨리 확인할 수 있다.

### 목표

PR 또는 수동 실행 시 다음을 자동 수행한다.
- `npm test`
- 필요 시 특정 테스트만 선택 실행
- 실패 로그 요약
- 실패 원인 후보 정리

### 1차 구현

- GitHub Actions에서 테스트 실행
- 실패 시 로그를 artifact로 남김
- 간단한 실패 분류:
  - assertion mismatch
  - import/runtime error
  - DOM query failure
  - snapshot/contract mismatch

### 2차 구현

- Playwright 도입 검토
- 포스트 상세, 홈, 시리즈 페이지 smoke E2E 추가
- 실패 스크린샷 기반 요약

### 대상 기능 후보

- 홈 목록 렌더링
- 포스트 상세 페이지
- 시리즈 페이지
- newsletter 제출 흐름

### 검증

- 의도적으로 실패하는 PR 생성
- 자동 코멘트가 실제 원인과 얼마나 맞는지 비교

### 완료 기준

- "테스트가 깨졌다" 수준이 아니라 "왜 깨졌는지" 1차 설명이 자동 제공됨

---

## 4. 장애 1차 분석 봇

### 왜 4번인가

앞선 세 단계에서 코드/테스트 자동화 기반을 만든 뒤에 운영 분석으로 넘어가야 한다.

### 목표

운영 이슈가 발생했을 때 다음을 한 번에 묶어 보여준다.
- 최근 배포 정보
- 관련 route/component
- 최근 변경된 파일
- 로그/에러 요약

### 현실적인 실습 방식

초기에는 Sentry 없이 mock incident로 시작:
- 예: newsletter API 500
- 예: 특정 slug page 404
- 예: view count route 실패

### 2차 확장

- Sentry 연동
- Vercel deployment metadata 연동
- 에러 이벤트 -> GitHub issue 자동 생성

### 산출물

- incident template
- 장애 triage 스크립트
- "확인할 항목" 자동 체크리스트

### 검증

- 샘플 장애 시나리오 3개에 대해 1차 분석 리포트 생성

### 완료 기준

- 온콜 초반에 사람이 해야 할 탐색을 AI가 절반 이상 줄여줌

---

## 5. API 문서와 런북 자동 갱신기

### 왜 5번인가

사이트 레포는 API route 수가 적어서 실습 범위가 통제 가능하다. 자동 문서화 패턴을 익히기 좋다.

### 목표

API route나 핵심 사용자 플로우가 바뀌면 관련 문서 초안을 자동 생성한다.

### 문서 대상

- `src/app/api/newsletter/route.ts`
- `src/app/api/views/[slug]/route.ts`
- `docs/content-contract.md`
- 운영용 env 문서

### 1차 구현

- route handler 시그니처/응답 코드/필수 env를 추출
- markdown 문서 초안 생성

### 2차 구현

- PR에서 코드 변경 감지
- 영향받는 문서를 자동 추천
- PR 코멘트로 "문서 업데이트 필요" 제안

### 검증

- route 수정 후 생성된 문서가 실제 코드와 맞는지 리뷰

### 완료 기준

- 문서가 사람이 뒤늦게 기억으로 쓰는 것이 아니라, 코드 변경 직후 초안이 먼저 생김

---

## 6. 반복 운영 쿼리 생성기

### 왜 6번인가

이건 백엔드/운영 팀 실무감이 강한 자동화다. 사이트 레포에서는 실제 DB가 크지 않더라도 로그/키-값 조회를 기준으로 패턴을 훈련할 수 있다.

### 목표

사건 설명을 넣으면 AI가 바로 쓸 수 있는 조회 명령/쿼리를 제안한다.

### 사이트 기준 적용 예시

- 특정 slug 조회수 이상 여부 확인
- newsletter 요청 실패 패턴 찾기
- 배포 이후 오류 급증 확인용 로그 필터 생성

### 실습 방식

실제 SQL이 없으면 pseudo query + log filter부터 시작:
- Vercel log filter
- Sentry search query
- KV key inspection command

### 산출물

- 운영 질문 -> 쿼리 템플릿 사전
- `docs/automation/ops-query-cookbook.md`

### 검증

- 자주 묻는 운영 질문 10개에 대한 답 쿼리 생성

### 완료 기준

- 운영 대응 시 "어떤 쿼리를 쳐야 하지?" 시간을 눈에 띄게 줄임

---

## 7. 배포 체크리스트 자동 수행 에이전트

### 왜 7번인가

이제 CI, 테스트, 문서, 운영 관측이 어느 정도 연결된 후라서 배포 체크 자동화가 실효성을 가진다.

### 목표

배포 전에 사람이 보던 체크리스트를 AI가 먼저 수행한다.

### 체크 항목 예시

- lint/test/build 성공 여부
- env 누락 여부
- content contract 위반 여부
- draft post 노출 여부
- canonical/metadata 기본값 누락 여부

### 구현 방식

- 수동 실행 가능한 pre-release script
- GitHub Action `workflow_dispatch`
- release PR용 체크 리포트 생성

### 검증

- 의도적으로 env 누락/metadata 누락 사례를 넣고 감지 확인

### 완료 기준

- 배포 전 반복 점검이 checklist 소비가 아니라 자동 보고서 소비로 바뀜

---

## 8. 오픈소스 이슈 대응 보조 워크플로우

### 왜 8번인가

이 단계부터는 내부 저장소 자동화를 넘어, 외부 이슈 처리 패턴을 학습하는 연습이 된다.

### 목표

예를 들어 Next.js, MDX, React, Tailwind 관련 외부 이슈를 읽고 다음을 초안화한다.
- 재현 절차
- 영향 범위
- 로컬 재현 계획
- PR 본문 초안

### 실습 방식

- 실제 외부 이슈 3개 선정
- 그중 1개는 `ai-survival-log-site`에서 재현 가능한 문제를 선택
- AI가 issue analysis 문서 생성

### 산출물

- `docs/automation/open-source-issue-lab.md`
- 재현 템플릿
- PR description 템플릿

### 검증

- 재현 성공 여부
- 수정안까지 이어질 수 있는지 평가

### 완료 기준

- 오픈소스 기여 진입 비용이 낮아지고, 분석 단계 시간을 크게 줄임

---

## 9. 경쟁사/기술 동향 모니터링 스크래퍼

### 왜 9번인가

앞 단계까지는 저장소 내부 자동화였다. 여기서부터는 외부 정보 수집 자동화로 확장한다.

### 목표

정해둔 사이트의 변경 사항을 주기적으로 수집하고 요약한다.

### 수집 대상 예시

- Next.js release notes
- Vercel changelog
- Resend changelog
- Langfuse changelog
- Sentry Next.js docs 업데이트

### 구현 방식

- RSS 우선
- 없으면 HTML fetch + selector parsing
- 변경 diff만 저장

### 산출물

- weekly digest markdown
- 변화 감지 기준
- 업데이트 우선순위 규칙

### 검증

- 2주치 또는 샘플 5개 변경 로그를 요약

### 완료 기준

- 기술 선택 관련 회의 전에 사람이 직접 돌아다니며 읽는 시간을 줄임

---

## 10. 사내 백오피스 반복 작업 자동화

### 왜 10번인가

가장 실무 효과가 크지만, 앞선 자동화 결과를 재사용할 때 가장 잘 작동한다.

### 목표

개발 외 반복 사무 작업을 AI가 먼저 처리한다.

### `ai-survival-log-site` 기준 예시

- 주간 변경 요약 보고서
- 배포/장애 회고 초안
- 콘텐츠 발행 현황 요약
- 테스트/품질 추세 요약

### 구현 방식

- GitHub activity + content changes + test summary 결합
- markdown report 자동 생성
- Slack/이메일 전송은 마지막 단계에서 추가

### 검증

- 한 주간 샘플 데이터를 기준으로 운영 보고서 자동 생성

### 완료 기준

- 팀 리드/개발자가 매주 손으로 하던 정리 작업이 검토 작업으로 바뀜

---

## 백엔드 개발자 기준 ROI 높은 3개와 실습 반영 순서

### 1. PR 요약 + 리뷰 포인트 생성기

이 저장소에서는 리뷰 품질과 변경 해석 속도를 가장 빠르게 개선한다. 가장 먼저 실습한다.

### 2. 장애 1차 분석 봇

운영 대응 비용이 가장 비싼 영역이라 ROI가 높다. 다만 1~3번 실습에서 쌓은 메타데이터를 활용해야 하므로 4번에 배치한다.

### 3. Jira 이슈 구현 계획 초안 생성기

구현 시작 전 비용을 줄여준다. 실습상으로는 2번에 넣는 것이 자연스럽다.

---

## 단계별 마일스톤

### Milestone A — 개발 워크플로우 자동화

대상:
- 1. PR 요약
- 2. 이슈 계획 초안
- 3. 테스트 실패 분석

성과 목표:
- PR 리뷰 준비 시간 단축
- 구현 시작 전 정리 시간 단축
- 테스트 실패 해석 시간 단축

### Milestone B — 운영/문서 자동화

대상:
- 4. 장애 1차 분석
- 5. 문서 갱신
- 6. 운영 쿼리 생성
- 7. 배포 체크

성과 목표:
- 운영 대응 시간 단축
- 문서 부채 감소
- 배포 안정성 향상

### Milestone C — 외부 확장/관리 자동화

대상:
- 8. 오픈소스 대응
- 9. 기술 동향 모니터링
- 10. 백오피스 자동화

성과 목표:
- 외부 학습 비용 절감
- 기술 변화 추적 자동화
- 정기 보고 자동화

---

## 각 실습 공통 산출물

모든 실습은 아래 네 가지를 남긴다.

1. 설계 메모
2. 최소 구현
3. 검증 기록
4. 다음 개선 포인트

문서 위치 권장:
- 설계: `docs/superpowers/specs/`
- 계획: `docs/superpowers/plans/`
- 운영 가이드: `docs/automation/`

---

## 추천 진행 방식

한 번에 10개를 병렬로 하지 않는다.

권장 cadence:
- 1주차: 1번
- 2주차: 2번
- 3주차: 3번
- 4주차: 4번
- 5주차: 5번, 6번
- 6주차: 7번
- 7주차: 8번
- 8주차: 9번, 10번

더 현실적인 압축 버전:
- Phase 1: 1, 2, 3
- Phase 2: 4, 5, 7
- Phase 3: 6, 8, 9, 10

---

## 지금 바로 시작할 첫 3개

`ai-survival-log-site` 기준으로 당장 시작할 첫 실습은 아래가 맞다.

1. PR 요약 + 리뷰 포인트 생성기
2. Jira 이슈 구현 계획 초안 생성기
3. 회귀 테스트 실행 + 실패 원인 정리 봇

이 세 개는 현재 레포에 이미 있는 테스트, 콘텐츠 계약, GitHub 이벤트와 가장 잘 맞고, 외부 서비스 의존도가 가장 낮다.
