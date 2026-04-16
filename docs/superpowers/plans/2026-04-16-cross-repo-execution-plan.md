# Cross-Repo Execution Plan for `ai-survival-log-site`

## 목적

이 문서는 `ai-survival-log`와 협업하는 전제에서, `ai-survival-log-site`가 실제 구현 담당 repo로서 무엇을 먼저 만들지 정리한 실행 계획이다.

참조 기준 문서:
- [upstream 협업 계획](</Users/ms/workspace/claude/ai-survival-log/docs/2026-04-16-cross-repo-ai-automation-collaboration-plan.md:1>)
- [site automation lab plan](</Users/ms/workspace/claude/ai-survival-log-site/docs/superpowers/plans/2026-04-16-ai-automation-lab-plan.md:1>)

## 실행 원칙

- 기준은 upstream에서 정의한다
- 실행은 site repo에서 먼저 검증한다
- runtime 자동화는 site에서 먼저 만든다
- 검증 결과는 다시 upstream 문서에 환류한다

## 현재 상태

- `1. PR 요약 + 리뷰 포인트 생성기` — 완료
  - workflow 추가 완료
  - script 추가 완료
  - 로컬 샘플 출력 검증 완료
- `2. Jira 이슈 구현 계획 초안 생성기` — 진행 예정
- 현재는 구현을 잠시 멈추고 PR summary 실습 복기 단계

## 1차 공통 실습 3개

### 1. PR 요약 + 리뷰 포인트 생성기

#### upstream manager가 먼저 준다

- PR 요약 포맷
- 변경 유형 taxonomy
- 리뷰 질문 템플릿

#### site manager가 구현한다

- `.github/workflows/pr-summary.yml`
- changed-files 분류 스크립트
- PR 코멘트 게시 로직

#### site repo 기준 완료 조건

- `src/`, `content/posts/`, `docs/` 변경을 구분한다
- 테스트 영향 범위를 표시한다
- 위험도 체크를 포함한다

### 2. Jira 이슈 구현 계획 초안 생성기

상태: `진행 예정`

#### upstream manager가 먼저 준다

- intake 문서 형식
- 계획 초안 형식
- 확인 질문 규칙

#### site manager가 구현한다

- markdown intake parser 또는 issue body parser
- 계획 초안 생성 스크립트
- 결과 markdown 출력 형식

#### site repo 기준 완료 조건

- 최소 3개 샘플 이슈에 대해 일관된 초안을 만든다
- 변경 파일 후보와 테스트 계획이 포함된다

### 3. 배포 체크리스트 자동 수행 에이전트

#### upstream manager가 먼저 준다

- publish/content contract 체크리스트
- 문서 정합성 기준

#### site manager가 구현한다

- lint/test/build/content contract 연결
- pre-release report 스크립트
- `workflow_dispatch` 또는 release PR workflow

#### site repo 기준 완료 조건

- 배포 전 반복 점검 항목이 자동 보고서로 나온다
- 사람이 따로 손으로 체크하던 항목 수가 줄어든다

## repo별 협업 인터페이스

### upstream -> site 입력물

- markdown 템플릿
- 체크리스트
- taxonomy
- 평가 기준

### site -> upstream 출력물

- 실행 결과
- false positive/negative 사례
- 개선이 필요한 규칙
- 다음 버전 요구사항

## 첫 구현 순서

1. PR summary
2. issue plan draft
3. deploy checklist

이 순서가 맞는 이유:
- 현재 레포에 이미 `lint`, `test`, `build`, `content contract`가 있다
- 구현 리스크가 낮다
- 성과가 빠르게 보인다

## 지금 바로 만들 파일 후보

### PR summary

- `.github/workflows/pr-summary.yml`
- `scripts/pr-summary.mjs`
- `docs/automation/pr-summary.md`

### Issue plan draft

- `docs/automation/intake/`
- `scripts/issue-plan-draft.mjs`
- `docs/automation/issue-plan-draft.md`

### Deploy checklist

- `.github/workflows/pre-release-check.yml`
- `scripts/pre-release-check.mjs`
- `docs/automation/pre-release-checklist.md`

## 검증 방식

각 항목은 다음 순서로 검증한다.

1. 로컬 실행
2. GitHub Actions dry run
3. 샘플 PR 또는 샘플 issue 적용
4. 결과 리뷰
5. upstream 기준 문서 피드백 반영

## 다음 단계

이 문서 다음의 실제 구현 시작점은:

1. PR summary 실습 복기
2. issue plan draft 요구사항 고정
3. script 초안 작성
