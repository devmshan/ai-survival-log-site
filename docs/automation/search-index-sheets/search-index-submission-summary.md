# Search Index Submission Summary

Generated from local post files. This report does not call Google or Naver APIs.

이 문서는 Google/Naver 검색 색인 제출 운영 시트의 요약이다. 외부 콘솔이나 API를 호출하지 않고, 로컬 post 파일과 입력된 site URL 기준으로 생성한다.

## Scope

| Item | Status |
| --- | --- |
| Site URL | `https://devsurvivallog.com` |
| Publishable posts | 28 |
| Sitemap status | present |
| Google P0 rows | 12 |
| Naver P0 rows | 12 |
| P0 manual submission | Google/Naver 12 URLs submitted on 2026-05-13 |

## Interpretation

- `todo`는 URL별 제출 완료 증거가 시트/저장소에 없다는 뜻이다.
- `evidence-missing`은 외부 콘솔에서는 이미 처리됐을 수 있으므로, 미실행 확정 전에 Search Console/Search Advisor에서 다시 확인해야 한다는 뜻이다.
- P0 URL은 2026-05-13에 Google Search Console URL Inspection 색인 생성 요청과 Naver Search Advisor 웹 페이지 수집 요청을 완료한 것으로 기록했다.
- 다음 확인일은 2026-05-16, 2026-05-20, 2026-05-27이다.
- Google Indexing API는 일반 블로그 글 제출 경로가 아니다.
- Naver IndexNow는 새 URL/변경 URL 알림에는 쓸 수 있지만, Search Advisor 수집요청, RSS, sitemap 제출을 대체하지 않는다.

## Engine Work

| Engine | Required work |
| --- | --- |
| Google | Search Console 소유권, sitemap 제출 상태, URL Inspection -> Request indexing, 색인 coverage 모니터링 |
| Naver | Search Advisor 소유 확인, sitemap/RSS 제출, P0 URL 웹 페이지 수집 요청, 승인된 경우 crawl-request API 또는 IndexNow 검토 |

## Value Matrix

이 시트는 LazyPad 기획에서 쓰던 가치평가 매트릭스를 적용한다. 1-5점 역할별 점수, 기획자/PL/검수자/디렉터 렌즈, 4.3-5.0은 P0, 3.6-4.2는 P1, 2.8-3.5는 P2로 본다. canonical, robots, 소유권, 404 문제가 있으면 평균과 무관하게 Blocker다.

## P0 Rows

| Date | URL | Avg |
| --- | --- | ---: |
| 2026-05-12 | `/posts/2026-05-12-web-frontend-01-web-to-frontend-ecosystem` | 4.5 |
| 2026-05-12 | `/posts/2026-05-12-web-frontend-02-browser-dom-reflow` | 4.5 |
| 2026-05-12 | `/posts/2026-05-12-web-frontend-03-jquery-to-react` | 4.6 |
| 2026-05-12 | `/posts/2026-05-12-web-frontend-04-node-npm-build` | 4.7 |
| 2026-05-12 | `/posts/2026-05-12-web-frontend-05-spa-ssr-nextjs-selection` | 4.6 |
| 2026-05-07 | `/posts/2026-05-07-ai-native-delegator-execution-evidence` | 4.4 |
| 2026-05-02 | `/posts/2026-05-02-ai-native-delegator-long-term-plan` | 4.3 |
| 2026-05-02 | `/posts/2026-05-02-codex-slack-notify-first-operating-signal` | 4.3 |
| 2026-05-02 | `/posts/2026-05-02-codex-task-brief-prompt-writing-lane` | 4.3 |
| 2026-05-02 | `/posts/2026-05-02-developer-automation-lab-01-pr-summary` | 4.5 |
| 2026-04-29 | `/posts/2026-04-29-developer-automation-lab-02-jira-ticket-automation` | 4.5 |
| 2026-04-29 | `/posts/2026-04-29-developer-automation-lab-03-jira-profile-boundary` | 4.5 |

## Sheets

- [google-index-submission-sheet.csv](google-index-submission-sheet.csv)
- [naver-index-submission-sheet.csv](naver-index-submission-sheet.csv)

## Official References

- Google: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Google: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google: https://developers.google.com/search/apis/indexing-api/v3/quickstart
- Naver: https://searchadvisor.naver.com/guide/request-crawl
- Naver: https://searchadvisor.naver.com/guide/request-feed
- Naver: https://searchadvisor.naver.com/guide/crawl-request-api
- Naver: https://searchadvisor.naver.com/guide/indexnow-faq
