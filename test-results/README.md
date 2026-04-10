# 테스트 결과 관리

## 네이밍 규칙

```
YYYY-MM-DD_<검증-대상>_<결과>.md
```

| 파트 | 설명 | 예시 |
|------|------|------|
| `YYYY-MM-DD` | 실행 날짜 | `2026-04-10` |
| `<검증-대상>` | 무엇을 테스트했는지 (kebab-case) | `ecc-code-review`, `newsletter-api` |
| `<결과>` | 핵심 지표 | `27-passed`, `coverage-100`, `3-failed` |

### 예시

```
2026-04-10_ecc-code-review_27-passed.md
2026-04-11_newsletter-api_coverage-100.md
2026-04-15_search-refactor_3-failed.md
```

## 폴더 구조

```
test-results/
├── README.md                              # 이 파일 (규칙 정의)
├── YYYY-MM-DD_<대상>_<결과>.md            # 테스트 문서 (git 추적)
├── results.json                           # 실행 결과 JSON (git 제외)
└── coverage/                             # 커버리지 리포트 (git 제외)
```

## 실행 명령어

```bash
npm test                # 단일 실행
npm run test:watch      # watch 모드
npm run test:coverage   # 커버리지 + test-results/ 산출물 생성
```
