#!/usr/bin/env bash
# 테스트 명령어 완료 후 test-results/ 문서 자동 생성
# PostToolUse(Bash) hook으로 실행됨

set -euo pipefail

PROJ_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RESULTS_JSON="$PROJ_DIR/test-results/results.json"

# stdin에서 hook payload 읽기
PAYLOAD=$(cat)

# 테스트 명령어인지 확인
CMD=$(echo "$PAYLOAD" | jq -r '.tool_input.command // ""')
if ! echo "$CMD" | grep -qE '(vitest|npm (run )?test)'; then
  exit 0
fi

# results.json 없으면 종료 (테스트가 실패해서 못 만든 경우)
if [ ! -f "$RESULTS_JSON" ]; then
  exit 0
fi

# 결과 파싱
PASSED=$(jq -r '.numPassedTests // 0' "$RESULTS_JSON")
FAILED=$(jq -r '.numFailedTests // 0' "$RESULTS_JSON")
TOTAL=$(jq -r '.numTotalTests // 0' "$RESULTS_JSON")
FILES=$(jq -r '.numTotalTestSuites // 0' "$RESULTS_JSON")

# 결과 접미사 결정
if [ "$FAILED" -eq 0 ]; then
  RESULT="${PASSED}-passed"
else
  RESULT="${FAILED}-failed"
fi

# 검증 대상 추출 (명령어에서 키워드 파싱, 없으면 unit-test)
if echo "$CMD" | grep -q 'coverage'; then
  TARGET="coverage"
elif echo "$CMD" | grep -q 'test:watch'; then
  TARGET="watch"
else
  TARGET="unit-test"
fi

DATE=$(date +%Y-%m-%d)
FILENAME="$PROJ_DIR/test-results/${DATE}_${TARGET}_${RESULT}.md"

# 이미 같은 이름 파일 있으면 덮어쓰지 않고 suffix 추가
if [ -f "$FILENAME" ]; then
  FILENAME="$PROJ_DIR/test-results/${DATE}_${TARGET}_${RESULT}_$(date +%H%M).md"
fi

# 커버리지 요약 추출 (있으면)
COVERAGE_SUMMARY=""
COVERAGE_JSON="$PROJ_DIR/test-results/coverage/coverage-summary.json"
if [ -f "$COVERAGE_JSON" ]; then
  STMTS=$(jq -r '.total.statements.pct // "N/A"' "$COVERAGE_JSON")
  BRANCHES=$(jq -r '.total.branches.pct // "N/A"' "$COVERAGE_JSON")
  FUNCS=$(jq -r '.total.functions.pct // "N/A"' "$COVERAGE_JSON")
  LINES=$(jq -r '.total.lines.pct // "N/A"' "$COVERAGE_JSON")
  COVERAGE_SUMMARY="
## 커버리지

| Statements | Branches | Functions | Lines |
|-----------|---------|----------|-------|
| ${STMTS}% | ${BRANCHES}% | ${FUNCS}% | ${LINES}% |
"
fi

# 문서 작성
cat > "$FILENAME" << EOF
# 테스트 결과: ${DATE}

## 요약

| 항목 | 결과 |
|------|------|
| 날짜 | ${DATE} |
| 명령어 | \`${CMD}\` |
| 전체 테스트 | ${TOTAL}개 |
| 통과 | ${PASSED}개 |
| 실패 | ${FAILED}개 |
| 테스트 파일 | ${FILES}개 |
| 결과 | $([ "$FAILED" -eq 0 ] && echo "PASS" || echo "FAIL") |
${COVERAGE_SUMMARY}
## 실행 명령어

\`\`\`bash
${CMD}
\`\`\`
EOF

echo "테스트 문서 생성: $FILENAME" >&2
