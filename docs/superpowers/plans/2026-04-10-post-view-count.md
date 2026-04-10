# Post View Count 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 게시글 조회수를 Vercel KV에 저장하고 홈 게시글 카드에 `👁 123` 형태로 표시한다.

**Architecture:** 포스트 상세 페이지(`/posts/[slug]`) 진입 시 `ViewTracker` 클라이언트 컴포넌트가 `POST /api/views/[slug]`를 호출해 KV INCR. 홈 카드의 `ViewCount` 클라이언트 컴포넌트가 `GET /api/views/{slug}`로 카운트를 읽어 표시. Vercel Analytics는 `layout.tsx`에 한 줄 추가로 대시보드 방문자 추적 활성화.

**Tech Stack:** Next.js 16 App Router, `@vercel/kv`, `@vercel/analytics`, vitest + @testing-library/react

---

## 파일 목록

| 파일 | 역할 |
|------|------|
| `src/app/api/views/[slug]/route.ts` | 신규: GET(조회) + POST(증가) API |
| `src/app/api/views/[slug]/__tests__/route.test.ts` | 신규: API route 유닛 테스트 |
| `src/components/post/ViewTracker.tsx` | 신규: 포스트 진입 시 조회수 증가 (Client) |
| `src/components/post/ViewCount.tsx` | 신규: 카드에 조회수 표시 (Client) |
| `src/components/post/__tests__/ViewTracker.test.tsx` | 신규: ViewTracker 유닛 테스트 |
| `src/components/post/__tests__/ViewCount.test.tsx` | 신규: ViewCount 유닛 테스트 |
| `src/components/post/PostCard.tsx` | 수정: ViewCount 추가 |
| `src/app/posts/[slug]/page.tsx` | 수정: ViewTracker 추가 |
| `src/app/layout.tsx` | 수정: `<Analytics />` 추가 |

---

## Task 1: 패키지 설치

**Files:**
- 없음 (package.json 자동 수정)

- [ ] **Step 1: 패키지 설치**

```bash
npm install @vercel/kv @vercel/analytics
```

Expected output: `added 2 packages` (또는 유사한 메시지)

- [ ] **Step 2: 로컬 환경변수 설정 확인**

Vercel KV를 로컬에서 사용하려면 `.env.local`에 KV 환경변수가 필요합니다.
Vercel 대시보드에서 KV를 생성하고 프로젝트에 연결한 뒤:

```bash
vercel env pull .env.local
```

`.env.local`에 아래 변수들이 생겼는지 확인:
```
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

> **로컬 테스트 시:** KV 환경변수가 없어도 테스트는 `@vercel/kv`를 mock하므로 통과합니다.

- [ ] **Step 3: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore: @vercel/kv, @vercel/analytics 패키지 설치"
```

---

## Task 2: API Route — GET/POST /api/views/[slug]

**Files:**
- Create: `src/app/api/views/[slug]/route.ts`
- Create: `src/app/api/views/[slug]/__tests__/route.test.ts`

- [ ] **Step 1: 테스트 파일 작성 (RED)**

`src/app/api/views/[slug]/__tests__/route.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGet = vi.fn()
const mockIncr = vi.fn()

vi.mock('@vercel/kv', () => ({
  kv: {
    get: mockGet,
    incr: mockIncr,
  },
}))

import { GET, POST } from '../route'

function makeRequest(method: string): Request {
  return new Request(`http://localhost/api/views/my-post`, { method })
}

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug }) }
}

describe('GET /api/views/[slug]', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('조회수를 반환한다', async () => {
    mockGet.mockResolvedValue(42)
    const res = await GET(makeRequest('GET') as never, makeParams('my-post'))
    const json = await res.json()
    expect(json).toEqual({ success: true, data: { views: 42 } })
    expect(res.status).toBe(200)
  })

  it('키가 없으면 0을 반환한다', async () => {
    mockGet.mockResolvedValue(null)
    const res = await GET(makeRequest('GET') as never, makeParams('my-post'))
    const json = await res.json()
    expect(json).toEqual({ success: true, data: { views: 0 } })
  })

  it('KV 오류 시 500을 반환한다', async () => {
    mockGet.mockRejectedValue(new Error('KV error'))
    const res = await GET(makeRequest('GET') as never, makeParams('my-post'))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})

describe('POST /api/views/[slug]', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('올바른 KV 키로 INCR을 호출한다', async () => {
    mockIncr.mockResolvedValue(1)
    const res = await POST(makeRequest('POST') as never, makeParams('my-post'))
    expect(mockIncr).toHaveBeenCalledWith('views:my-post')
    const json = await res.json()
    expect(json).toEqual({ success: true })
    expect(res.status).toBe(200)
  })

  it('KV 오류 시 500을 반환한다', async () => {
    mockIncr.mockRejectedValue(new Error('KV error'))
    const res = await POST(makeRequest('POST') as never, makeParams('my-post'))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})
```

- [ ] **Step 2: 테스트 실행 — FAIL 확인**

```bash
npm test src/app/api/views
```

Expected: `FAIL` — `Cannot find module '../route'`

- [ ] **Step 3: API Route 구현**

`src/app/api/views/[slug]/route.ts`:

```typescript
import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: Promise<{ slug: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  try {
    const views = await kv.get<number>(`views:${slug}`)
    return NextResponse.json({ success: true, data: { views: views ?? 0 } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch views' },
      { status: 500 }
    )
  }
}

export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  try {
    await kv.incr(`views:${slug}`)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to increment views' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 4: 테스트 실행 — PASS 확인**

```bash
npm test src/app/api/views
```

Expected: `PASS` — 5개 테스트 모두 통과

- [ ] **Step 5: 커밋**

```bash
git add src/app/api/views/
git commit -m "feat: POST/GET /api/views/[slug] — Vercel KV 조회수 API 추가"
```

---

## Task 3: ViewTracker 컴포넌트

**Files:**
- Create: `src/components/post/ViewTracker.tsx`
- Create: `src/components/post/__tests__/ViewTracker.test.tsx`

- [ ] **Step 1: 테스트 파일 작성 (RED)**

`src/components/post/__tests__/ViewTracker.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { ViewTracker } from '../ViewTracker'

describe('ViewTracker', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('마운트 시 POST /api/views/[slug]를 호출한다', () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)

    render(<ViewTracker slug="my-post" />)

    expect(mockFetch).toHaveBeenCalledWith('/api/views/my-post', { method: 'POST' })
  })

  it('아무것도 렌더링하지 않는다', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    const { container } = render(<ViewTracker slug="my-post" />)
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 2: 테스트 실행 — FAIL 확인**

```bash
npm test src/components/post/__tests__/ViewTracker
```

Expected: `FAIL` — `Cannot find module '../ViewTracker'`

- [ ] **Step 3: ViewTracker 구현**

`src/components/post/ViewTracker.tsx`:

```typescript
'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  slug: string
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: 'POST' })
  }, [slug])

  return null
}
```

- [ ] **Step 4: 테스트 실행 — PASS 확인**

```bash
npm test src/components/post/__tests__/ViewTracker
```

Expected: `PASS` — 2개 테스트 모두 통과

- [ ] **Step 5: 커밋**

```bash
git add src/components/post/ViewTracker.tsx src/components/post/__tests__/ViewTracker.test.tsx
git commit -m "feat: ViewTracker — 포스트 진입 시 조회수 자동 증가 컴포넌트"
```

---

## Task 4: ViewCount 컴포넌트

**Files:**
- Create: `src/components/post/ViewCount.tsx`
- Create: `src/components/post/__tests__/ViewCount.test.tsx`

- [ ] **Step 1: 테스트 파일 작성 (RED)**

`src/components/post/__tests__/ViewCount.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ViewCount } from '../ViewCount'

describe('ViewCount', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('로딩 중에는 —를 표시한다', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          json: () => Promise.resolve({ success: true, data: { views: 42 } }),
        }), 500))
      )
    )
    render(<ViewCount slug="my-post" />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('fetch 성공 시 조회수를 표시한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: { views: 42 } }),
    }))
    render(<ViewCount slug="my-post" />)
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  it('fetch 실패 시 —를 유지한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
    render(<ViewCount slug="my-post" />)
    await waitFor(() => {
      expect(screen.getByText('—')).toBeInTheDocument()
    })
  })

  it('올바른 엔드포인트를 호출한다', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: { views: 0 } }),
    })
    vi.stubGlobal('fetch', mockFetch)
    render(<ViewCount slug="my-post" />)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/views/my-post')
    })
  })
})
```

- [ ] **Step 2: 테스트 실행 — FAIL 확인**

```bash
npm test src/components/post/__tests__/ViewCount
```

Expected: `FAIL` — `Cannot find module '../ViewCount'`

- [ ] **Step 3: ViewCount 구현**

`src/components/post/ViewCount.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

interface ViewCountProps {
  slug: string
}

export function ViewCount({ slug }: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/views/${slug}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setViews(json.data.views)
      })
      .catch(() => {
        // 실패 시 — 유지
      })
  }, [slug])

  return (
    <span className="flex items-center gap-1">
      <Eye className="w-3 h-3" />
      {views === null ? '—' : views}
    </span>
  )
}
```

- [ ] **Step 4: 테스트 실행 — PASS 확인**

```bash
npm test src/components/post/__tests__/ViewCount
```

Expected: `PASS` — 4개 테스트 모두 통과

- [ ] **Step 5: 커밋**

```bash
git add src/components/post/ViewCount.tsx src/components/post/__tests__/ViewCount.test.tsx
git commit -m "feat: ViewCount — 게시글 카드 조회수 표시 컴포넌트"
```

---

## Task 5: PostCard에 ViewCount 연결

**Files:**
- Modify: `src/components/post/PostCard.tsx`

- [ ] **Step 1: PostCard 수정**

`src/components/post/PostCard.tsx`의 날짜/읽기시간 영역에 ViewCount 추가:

```typescript
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ViewCount } from '@/components/post/ViewCount'
import type { PostMeta } from '@/lib/types'

interface PostCardProps {
  post: PostMeta
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        {post.thumbnail && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {post.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
            <span>·</span>
            <ViewCount slug={post.slug} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

- [ ] **Step 2: 빌드 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/components/post/PostCard.tsx
git commit -m "feat: PostCard에 ViewCount 연결 — 게시글 카드에 조회수 표시"
```

---

## Task 6: Post 페이지에 ViewTracker 연결

**Files:**
- Modify: `src/app/posts/[slug]/page.tsx`

- [ ] **Step 1: Post 페이지 수정**

`src/app/posts/[slug]/page.tsx`의 `<article>` 안에 ViewTracker 추가:

```typescript
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import { TableOfContents } from '@/components/post/TableOfContents'
import { PrevNextNav } from '@/components/post/PrevNextNav'
import { GiscusComments } from '@/components/post/GiscusComments'
import { ViewTracker } from '@/components/post/ViewTracker'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  let post
  try {
    post = getPostBySlug(slug)
  } catch {
    notFound()
  }

  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex(p => p.slug === slug)
  const prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  return (
    <article>
      <ViewTracker slug={slug} />
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-8">
        <div id="post-content" className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
          />
        </div>
        <aside className="hidden lg:block sticky top-8 h-fit">
          <TableOfContents />
        </aside>
      </div>

      <PrevNextNav prev={prev} next={next} />
      <GiscusComments />
    </article>
  )
}
```

- [ ] **Step 2: 빌드 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/posts/[slug]/page.tsx
git commit -m "feat: Post 페이지에 ViewTracker 연결 — 포스트 진입 시 조회수 자동 증가"
```

---

## Task 7: Vercel Analytics 추가

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: layout.tsx 수정**

`src/app/layout.tsx`에 `<Analytics />` 추가:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getAllPosts } from '@/lib/posts'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchProvider } from '@/contexts/SearchContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AI Survival Log',
    template: '%s | AI Survival Log',
  },
  description: '개인 블로그 & AI 학습 기록',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllPosts()

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SearchProvider>
            <div className="min-h-screen flex flex-col">
              <SearchBar posts={posts} />
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                {children}
              </main>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: 전체 테스트 실행**

```bash
npm test
```

Expected: 전체 테스트 PASS

- [ ] **Step 3: 커밋**

```bash
git add src/app/layout.tsx
git commit -m "feat: Vercel Analytics 활성화 — 대시보드 방문자 추적"
```

---

## Vercel 대시보드 설정 (배포 전 필수)

1. **Vercel KV 생성:** Dashboard → Storage → Create Database → KV → 프로젝트 연결
2. **Vercel Analytics 활성화:** Dashboard → 프로젝트 → Analytics → Enable

---

## 참고: 날짜 기반 추적 (KST)

현재 구현에는 날짜 기반 KV 키가 없습니다 (도메인 방문자 일별 추적 제외).
추후 일별 통계가 필요할 경우 KST(UTC+9) 기준 날짜 키 사용:

```typescript
const KST_OFFSET = 9 * 60 * 60 * 1000
const now = new Date(Date.now() + KST_OFFSET)
const dateKey = now.toISOString().slice(0, 10) // "2026-04-10"
```
