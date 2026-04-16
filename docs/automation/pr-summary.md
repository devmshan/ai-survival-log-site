# PR Summary Automation

## 목적

이 자동화는 PR마다 아래를 빠르게 드러내기 위한 것이다.

- 무엇이 바뀌었는가
- 어디를 먼저 리뷰해야 하는가
- 어떤 검증이 필요한가

기준 문서는 upstream repo의 [PR Summary Standard](</Users/ms/workspace/claude/ai-survival-log/docs/2026-04-16-pr-summary-standard.md:1>)를 따른다.

## 현재 구현 범위

1차 구현은 LLM 없이 규칙 기반으로 동작한다.

포함:
- changed files 수집
- 파일 경로 기반 범주 분류
- 위험도 추정
- 테스트 영향 분석
- 리뷰 포인트 생성

제외:
- 자연어 diff 해석
- 실제 코드 의미 분석
- PR 본문 자동 대체

## 출력 형식

스크립트는 다음 블록을 생성한다.

- `PR Summary`
- `Changed Files`
- `Test Impact`
- `Review Points`
- `Reviewer Questions`

## 로컬 실행

현재 워킹트리 기준:

```bash
node scripts/pr-summary.mjs
```

특정 파일 목록을 직접 넣기:

```bash
node scripts/pr-summary.mjs --files "src/lib/posts.ts,src/app/posts/[slug]/page.tsx,src/lib/__tests__/posts.test.ts"
```

파일로 저장:

```bash
node scripts/pr-summary.mjs --files "docs/content-contract.md,scripts/verify-content-contract.mjs" --output /tmp/pr-summary.md
```

## GitHub Actions 사용 방식

PR 이벤트에서 base/head SHA를 받아 실행한다.

```bash
node scripts/pr-summary.mjs --base "$BASE_SHA" --head "$HEAD_SHA" --output pr-summary.md
```

그 다음 workflow에서 generated markdown을 PR 코멘트로 게시한다.

## 해석 규칙 메모

- `src/app/api/` 변경은 `api`
- `src/components/`, `src/app/` 변경은 `ui`
- `src/lib/` 변경은 `data-loading`
- `content/posts/` 변경은 `content`
- `docs/`, `README.md`, `AGENTS.md`, `CLAUDE.md` 변경은 `docs`
- `scripts/`, `.github/`, `package.json` 변경은 `build-ci`

## 한계

- 파일 경로 기반이라 실제 의미를 완전히 이해하지는 못한다
- 대규모 PR에서는 리뷰 포인트가 다소 일반적으로 보일 수 있다
- 이후 2차 버전에서 LLM 요약을 붙일 수 있다
