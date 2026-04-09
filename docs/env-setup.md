# 환경변수 설정 가이드

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 항목들을 채웁니다.

---

## Giscus (댓글)

GitHub Discussions 기반 댓글 시스템입니다.

### 준비 조건

1. GitHub 저장소가 **public**이어야 함
2. 저장소 Settings → Features → **Discussions** 체크
3. [github.com/apps/giscus](https://github.com/apps/giscus) 에서 해당 저장소에 Giscus 앱 설치

### 값 얻기

1. [giscus.app](https://giscus.app) 접속
2. 저장소 이름 입력 (예: `username/ai-survival-log-site`)
3. Discussion Category 선택 (보통 `General`)
4. 하단에 생성된 스크립트에서 값 확인:

```html
<script
  data-repo="username/repo"        ← NEXT_PUBLIC_GISCUS_REPO
  data-repo-id="R_kgDO..."        ← NEXT_PUBLIC_GISCUS_REPO_ID
  data-category="General"         ← NEXT_PUBLIC_GISCUS_CATEGORY
  data-category-id="DIC_kwDO..."  ← NEXT_PUBLIC_GISCUS_CATEGORY_ID
```

---

## Resend (뉴스레터)

### RESEND_API_KEY

1. [resend.com](https://resend.com) 가입
2. Dashboard → API Keys → **Create API Key**
3. 생성된 키 복사 (`re_xxxxx` 형태)

### RESEND_SEGMENT_ID

> Resend v6부터 Audiences가 Segments로 리네임되었습니다.

1. Resend Dashboard → **Contacts** → **Segments** 탭
2. Segment 생성 또는 기존 Segment 선택
3. 상세 페이지 URL에서 UUID 확인
   - URL 예시: `https://resend.com/audiences/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - 그 UUID가 `RESEND_SEGMENT_ID`

---

## `.env.local` 완성 예시

```env
NEXT_PUBLIC_GISCUS_REPO=username/ai-survival-log-site
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOxxxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxxxxxx4A

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_SEGMENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> `.env.local`은 `.gitignore`에 포함되어 있어 git에 올라가지 않습니다.

---

## Vercel 배포

### 1단계 — 프로젝트 생성

1. [vercel.com](https://vercel.com) 로그인 (GitHub 계정 연동 권장)
2. **Add New → Project** 클릭
3. GitHub 저장소 목록에서 `ai-survival-log-site` 선택 → **Import**
4. Framework는 **Next.js** 자동 감지됨
5. **Deploy** 클릭

### 2단계 — 환경변수 설정

배포 후 **Settings → Environment Variables**에서 아래 항목 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_GISCUS_REPO` | `devmshan/ai-survival-log-site` |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | giscus.app에서 확인한 값 |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | `General` |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | giscus.app에서 확인한 값 |
| `RESEND_API_KEY` | `re_xxxxx` |
| `RESEND_SEGMENT_ID` | Resend Segment UUID |

> 환경변수 추가 후 **Deployments → Redeploy** 해야 반영됩니다.

### 3단계 — 이후 자동 배포

- `main` 브랜치에 push 시 자동 재배포
- PR 생성 시 Preview URL 자동 생성

### 도메인 (선택)

**Settings → Domains**에서 커스텀 도메인 연결 가능.
미설정 시 `ai-survival-log-site.vercel.app` 형태로 제공됨.

### 로그 확인

배포 후 문제 발생 시 **Deployments → 해당 배포 → Functions 탭**에서 API 로그 확인.
