# Search Index Action Plan

Generated: 2026-05-13  
Scope: `https://devsurvivallog.com` published post URLs only

## 결정

Google/Naver 모두 `P0 12개 -> P1 16개 -> 3/7/14일 모니터링` 순서로 진행한다. 현재 공개 `robots.txt`와 `sitemap.xml`은 통과했지만, repo 안에 URL별 Search Console/Search Advisor 제출 완료 ledger가 없으므로 모든 URL은 `todo/evidence-missing` 상태에서 시작한다.

## 우선순위

| Batch | 대상 | 기준 | 실행 |
| --- | ---: | --- | --- |
| Preflight | 사이트 단위 | 소유권, sitemap 제출, canonical 확인 | Google Search Console / Naver Search Advisor에서 먼저 확인 |
| P0 | 12 URLs | 평균 4.3-5.0, 최근 발행/시리즈/검색 의도 강함 | 당일 수동 제출. quota가 걸리면 다음 날 이어서 처리 |
| P1 | 16 URLs | 평균 3.6-4.2, sitemap으로 발견 가능하지만 ledger 없음 | P0 이후 다음 배치. console 상태가 좋으면 같은 주 완료 |
| Monitor | 28 URLs | 제출 후 색인/제외 사유 확인 | 3일, 7일, 14일에 상태 갱신 |

P0는 `AI 웹개발 기초` 5편, `AI Native 위임자` 4편, `Developer Automation Lab` 3편이다. 전체 URL은 [google-index-submission-sheet.csv](google-index-submission-sheet.csv), [naver-index-submission-sheet.csv](naver-index-submission-sheet.csv)를 기준으로 처리한다.

## 다역할 전문가 논의

| 역할 | 판단 |
| --- | --- |
| SEO 운영자 | Google은 URL Inspection과 sitemap 상태 확인이 핵심이다. 일반 블로그에 Indexing API를 쓰지 않는다. |
| Naver 운영자 | Search Advisor 소유 확인, sitemap/RSS 제출, 웹 페이지 수집 요청을 먼저 한다. IndexNow는 보조 수단이다. |
| 콘텐츠 전략가 | 최근 프론트엔드 시리즈와 자동화 시리즈는 검색 의도가 분명해 P0가 맞다. 회고/철학 글은 P1로 충분하다. |
| 검수자 | 제출 완료 여부를 기억에 의존하면 안 된다. CSV의 `status`, `evidence`, `checked_at`, `result`를 갱신하는 운영 기록이 필요하다. |
| PL | 당일에 모든 URL을 무리해서 끝내기보다 P0를 먼저 끝내고, quota와 콘솔 경고를 본 뒤 P1을 처리한다. |

## 디렉터 3차 검수

| Pass | 판정 | 지시 |
| --- | --- | --- |
| 1차: 범위 검수 | 승인 | 사이트 구조 변경이 아니라 검색엔진 운영 작업으로 한정한다. 본문 리라이트와 섞지 않는다. |
| 2차: 리스크 검수 | 조건부 승인 | Google Indexing API, Naver crawl-request API는 기본 경로에서 제외한다. credential-backed 작업은 별도 승인 없이는 하지 않는다. |
| 3차: 실행 검수 | 최종 승인 | P0 12개를 먼저 제출하고, 같은 날 시트 상태를 갱신한다. P1은 quota/상태 확인 후 같은 주 안에 완료한다. |

## 실행 순서

1. Google Search Console에서 `devsurvivallog.com` 속성, sitemap 제출 상태, URL Inspection 접근을 확인한다.
2. Naver Search Advisor에서 사이트 소유권, sitemap/RSS 제출 상태, 수집 요청 메뉴 접근을 확인한다.
3. P0 12개를 Google URL Inspection에서 검사하고 `Request indexing`을 요청한다.
4. P0 12개를 Naver Search Advisor에서 웹 페이지 수집 요청한다.
5. CSV에 `status=submitted`, `checked_at=YYYY-MM-DD`, `result`, `evidence`를 갱신한다.
6. P1 16개는 quota가 남으면 같은 방식으로 처리하고, 아니면 다음 작업일로 넘긴다.
7. 3일/7일/14일 뒤 `indexed`, `excluded`, `not-discovered`, `blocked` 중 하나로 결과를 갱신한다.

## 완료 기준

- Google/Naver CSV 모두 28개 URL의 `status`가 `submitted`, `indexed`, `monitor`, 또는 `blocked` 중 하나로 갱신된다.
- `blocked`가 있으면 canonical, robots, 404, 소유권, sitemap 누락 중 원인을 적는다.
- Search Console/Search Advisor에서 sitemap 처리 상태와 대표 P0 URL 색인 상태를 확인한다.
- 다음 새 글부터는 발행 당일 P0/P1 판정과 제출 기록을 같은 시트에 누적한다.
