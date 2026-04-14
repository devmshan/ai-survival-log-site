# Series Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 블로그 포스트를 시리즈로 묶어 상단 접이식 패널과 시리즈 인덱스 페이지를 통해 독자가 연재 흐름을 탐색할 수 있게 한다.

**Architecture:** frontmatter의 `series`, `seriesSlug`, `seriesOrder` 필드로 시리즈를 정의하고, `posts.ts`에서 파싱 및 그룹핑한다. 포스트 상세 페이지에 Server Component 기반 접이식 패널을 추가하고, `/series/[slug]` 인덱스 페이지를 신설한다.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui (Badge, Card), Vitest, React Testing Library

---

## 파일 변경 목록

| 파일 | 유형 |
|------|------|
| `src/lib/types.ts` | 수정 |
| `src/lib/posts.ts` | 수정 |
| `src/lib/__tests__/posts.test.ts` | 수정 |
| `src/components/post/SeriesPanel.tsx` | 신규 |
| `src/components/post/__tests__/SeriesPanel.test.tsx` | 신규 |
| `src/components/series/SeriesCard.tsx` | 신규 |
| `src/app/series/page.tsx` | 신규 |
| `src/app/series/[slug]/page.tsx` | 신규 |
| `src/app/posts/[slug]/page.tsx` | 수정 |
| `content/posts/2026-04-14-system-design-interview-01.mdx` | 수정 |

---

## Task 1: 타입 확장

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: types.ts 수정**

```typescript
export interface PostMeta {
  title: string
  date: string
  tags: string[]
  description: string
  thumbnail?: string
  draft: boolean
  slug: string
  readingTime: string
  series?: string
  seriesSlug?: string
  seriesOrder?: number
}

export interface Post extends PostMeta {
  content: string
}

export interface SeriesPostEntry {
  slug: string
  title: string
  seriesOrder: number
}

export interface SeriesMeta {
  name: string
  slug: string
  posts: SeriesPostEntry[]
}
```

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음 (posts.ts에서 `satisfies PostMeta`가 새 optional 필드를 허용함)

- [ ] **Step 3: 커밋**

```bash
git add src/lib/types.ts
git commit -m "feat: PostMeta에 시리즈 필드 추가, SeriesPostEntry/SeriesMeta 타입 신설"
```

---

## Task 2: posts.ts 파싱 + getAllSeries / getSeriesBySlug

**Files:**
- Modify: `src/lib/posts.ts`
- Modify: `src/lib/__tests__/posts.test.ts`

- [ ] **Step 1: 시리즈 픽스처 추가 및 실패 테스트 작성**

`src/lib/__tests__/posts.test.ts` 하단에 추가:

```typescript
const MOCK_SERIES_1 = `---
title: 시리즈 1편
date: 2026-04-10
tags: [system-design]
description: 1편 설명
draft: false
series: "대규모 시스템 설계 스터디"
seriesSlug: "system-design-interview"
seriesOrder: 1
---
# 1편 본문
`

const MOCK_SERIES_2 = `---
title: 시리즈 2편
date: 2026-04-11
tags: [system-design]
description: 2편 설명
draft: false
series: "대규모 시스템 설계 스터디"
seriesSlug: "system-design-interview"
seriesOrder: 2
---
# 2편 본문
`

const MOCK_SERIES_DRAFT = `---
title: 시리즈 3편 (미완성)
date: 2026-04-12
tags: [system-design]
description: 3편 설명
draft: true
series: "대규모 시스템 설계 스터디"
seriesSlug: "system-design-interview"
seriesOrder: 3
---
# 3편 본문
`

describe('getAllSeries', () => {
  beforeEach(async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue([
      'series-01.mdx',
      'series-02.mdx',
      'series-draft.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('series-01')) return MOCK_SERIES_1
      if (String(filePath).includes('series-02')) return MOCK_SERIES_2
      return MOCK_SERIES_DRAFT
    })
  })

  it('draft 포스트를 제외하고 시리즈를 반환한다', () => {
    const { getAllSeries } = require('../posts')
    const series = getAllSeries()
    expect(series).toHaveLength(1)
    expect(series[0].posts).toHaveLength(2)
  })

  it('seriesOrder 순으로 정렬된 posts를 반환한다', () => {
    const { getAllSeries } = require('../posts')
    const series = getAllSeries()
    expect(series[0].posts[0].title).toBe('시리즈 1편')
    expect(series[0].posts[1].title).toBe('시리즈 2편')
  })

  it('SeriesPostEntry에는 slug, title, seriesOrder만 포함된다', () => {
    const { getAllSeries } = require('../posts')
    const series = getAllSeries()
    const entry = series[0].posts[0]
    expect(entry).toEqual({ slug: 'series-01', title: '시리즈 1편', seriesOrder: 1 })
  })

  it('name과 slug를 올바르게 반환한다', () => {
    const { getAllSeries } = require('../posts')
    const series = getAllSeries()
    expect(series[0].name).toBe('대규모 시스템 설계 스터디')
    expect(series[0].slug).toBe('system-design-interview')
  })
})

describe('getSeriesBySlug', () => {
  beforeEach(async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue([
      'series-01.mdx',
      'series-02.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('series-01')) return MOCK_SERIES_1
      return MOCK_SERIES_2
    })
  })

  it('slug에 해당하는 시리즈를 반환한다', () => {
    const { getSeriesBySlug } = require('../posts')
    const series = getSeriesBySlug('system-design-interview')
    expect(series).toBeDefined()
    expect(series!.name).toBe('대규모 시스템 설계 스터디')
  })

  it('존재하지 않는 slug면 undefined를 반환한다', () => {
    const { getSeriesBySlug } = require('../posts')
    const series = getSeriesBySlug('not-exist')
    expect(series).toBeUndefined()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/lib/__tests__/posts.test.ts
```

Expected: `getAllSeries is not a function` 에러로 실패

- [ ] **Step 3: posts.ts 구현**

`src/lib/posts.ts`에 import 추가 및 기존 `getAllPosts` 수정, 신규 함수 추가:

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Post, PostMeta, SeriesMeta, SeriesPostEntry } from './types'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))

  return files
    .map(filename => {
      const slug = filename.replace(/\.(mdx|md)$/, '')
      const filePath = path.join(POSTS_DIR, filename)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        tags: data.tags ?? [],
        description: data.description ?? '',
        thumbnail: data.thumbnail,
        draft: data.draft ?? false,
        readingTime: readingTime(content).text,
        series: data.series,
        seriesSlug: data.seriesSlug,
        seriesOrder: data.seriesOrder,
      } satisfies PostMeta
    })
    .filter(post => !post.draft)
    .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post {
  const extensions = ['mdx', 'md']
  let filePath = ''

  for (const ext of extensions) {
    const candidate = path.join(POSTS_DIR, `${slug}.${ext}`)
    if (fs.existsSync(candidate)) {
      filePath = candidate
      break
    }
  }

  if (!filePath) throw new Error(`Post not found: ${slug}`)

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    tags: data.tags ?? [],
    description: data.description ?? '',
    thumbnail: data.thumbnail,
    draft: data.draft ?? false,
    readingTime: readingTime(content).text,
    content,
    series: data.series,
    seriesSlug: data.seriesSlug,
    seriesOrder: data.seriesOrder,
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set(posts.flatMap(p => p.tags))
  return Array.from(tagSet).sort()
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter(p => p.tags.includes(tag))
}

export function getAllSeries(): SeriesMeta[] {
  const posts = getAllPosts()
  const seriesMap = new Map<string, { name: string; posts: PostMeta[] }>()

  for (const post of posts) {
    if (!post.series || !post.seriesSlug) continue

    if (!seriesMap.has(post.seriesSlug)) {
      seriesMap.set(post.seriesSlug, { name: post.series, posts: [] })
    }
    seriesMap.get(post.seriesSlug)!.posts.push(post)
  }

  return Array.from(seriesMap.entries()).map(([slug, { name, posts: seriesPosts }]) => {
    const orders = seriesPosts.map(p => p.seriesOrder).filter(Boolean)
    const hasDuplicates = new Set(orders).size !== orders.length
    if (hasDuplicates) {
      console.warn(`[series] seriesOrder 중복 감지: slug="${slug}" — date 기준 2차 정렬 적용`)
    }

    const sorted = [...seriesPosts].sort((a, b) => {
      const orderA = a.seriesOrder ?? 0
      const orderB = b.seriesOrder ?? 0
      if (orderA !== orderB) return orderA - orderB
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    return {
      name,
      slug,
      posts: sorted.map((p): SeriesPostEntry => ({
        slug: p.slug,
        title: p.title,
        seriesOrder: p.seriesOrder ?? 0,
      })),
    }
  })
}

export function getSeriesBySlug(slug: string): SeriesMeta | undefined {
  return getAllSeries().find(s => s.slug === slug)
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npx vitest run src/lib/__tests__/posts.test.ts
```

Expected: 전체 PASS

- [ ] **Step 5: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 6: 커밋**

```bash
git add src/lib/posts.ts src/lib/__tests__/posts.test.ts
git commit -m "feat: posts.ts에 시리즈 파싱 추가, getAllSeries/getSeriesBySlug 구현"
```

---

## Task 3: SeriesPanel 컴포넌트

**Files:**
- Create: `src/components/post/SeriesPanel.tsx`
- Create: `src/components/post/__tests__/SeriesPanel.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`src/components/post/__tests__/SeriesPanel.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeriesPanel } from '../SeriesPanel'
import type { SeriesMeta } from '@/lib/types'

const mockSeries: SeriesMeta = {
  name: '대규모 시스템 설계 스터디',
  slug: 'system-design-interview',
  posts: [
    { slug: 'series-01', title: '1편. 서버 1대에서 시작', seriesOrder: 1 },
    { slug: 'series-02', title: '2편. 데이터베이스 설계', seriesOrder: 2 },
    { slug: 'series-03', title: '3편. 캐시 전략', seriesOrder: 3 },
  ],
}

describe('SeriesPanel', () => {
  it('시리즈 이름을 렌더링한다', () => {
    render(<SeriesPanel series={mockSeries} currentSlug="series-01" />)
    expect(screen.getByText('대규모 시스템 설계 스터디')).toBeInTheDocument()
  })

  it('현재 편수를 표시한다', () => {
    render(<SeriesPanel series={mockSeries} currentSlug="series-02" />)
    expect(screen.getByText('2/3편')).toBeInTheDocument()
  })

  it('현재 포스트를 링크가 아닌 텍스트로 렌더링한다', () => {
    render(<SeriesPanel series={mockSeries} currentSlug="series-01" />)
    const currentTitle = screen.getByText('1편. 서버 1대에서 시작')
    expect(currentTitle.tagName).not.toBe('A')
  })

  it('다른 포스트는 링크로 렌더링한다', () => {
    render(<SeriesPanel series={mockSeries} currentSlug="series-01" />)
    const link = screen.getByRole('link', { name: '2편. 데이터베이스 설계' })
    expect(link).toHaveAttribute('href', '/posts/series-02')
  })

  it('전체 포스트 목록을 렌더링한다', () => {
    render(<SeriesPanel series={mockSeries} currentSlug="series-01" />)
    expect(screen.getByText('1편. 서버 1대에서 시작')).toBeInTheDocument()
    expect(screen.getByText('2편. 데이터베이스 설계')).toBeInTheDocument()
    expect(screen.getByText('3편. 캐시 전략')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/components/post/__tests__/SeriesPanel.test.tsx
```

Expected: `Cannot find module '../SeriesPanel'` 에러로 실패

- [ ] **Step 3: SeriesPanel 구현**

`src/components/post/SeriesPanel.tsx`:

```typescript
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { SeriesMeta } from '@/lib/types'

interface SeriesPanelProps {
  series: SeriesMeta
  currentSlug: string
}

export function SeriesPanel({ series, currentSlug }: SeriesPanelProps) {
  const currentIndex = series.posts.findIndex(p => p.slug === currentSlug)

  return (
    <details className="border rounded-lg p-4 mb-8 bg-muted/30">
      <summary className="cursor-pointer flex items-center gap-2 font-medium list-none">
        <Badge variant="secondary">
          {currentIndex + 1}/{series.posts.length}편
        </Badge>
        <span>{series.name}</span>
      </summary>
      <ol className="mt-4 space-y-2 pl-1">
        {series.posts.map((post, idx) => (
          <li key={post.slug} className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground w-4 shrink-0">{idx + 1}.</span>
            {post.slug === currentSlug ? (
              <span className="font-semibold text-foreground">{post.title}</span>
            ) : (
              <Link
                href={`/posts/${post.slug}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {post.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </details>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npx vitest run src/components/post/__tests__/SeriesPanel.test.tsx
```

Expected: 전체 PASS

- [ ] **Step 5: 커밋**

```bash
git add src/components/post/SeriesPanel.tsx src/components/post/__tests__/SeriesPanel.test.tsx
git commit -m "feat: SeriesPanel 컴포넌트 구현 (접이식 시리즈 패널)"
```

---

## Task 4: 포스트 상세 페이지 수정

**Files:**
- Modify: `src/app/posts/[slug]/page.tsx`

- [ ] **Step 1: page.tsx 수정**

```typescript
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { getAllPosts, getPostBySlug, getSeriesBySlug } from '@/lib/posts'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import { TableOfContents } from '@/components/post/TableOfContents'
import { PrevNextNav } from '@/components/post/PrevNextNav'
import { GiscusComments } from '@/components/post/GiscusComments'
import { ViewTracker } from '@/components/post/ViewTracker'
import { SeriesPanel } from '@/components/post/SeriesPanel'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'
import type { PostMeta } from '@/lib/types'

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
    title: post.series ? `${post.title} — ${post.series}` : post.title,
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

  const series = post.seriesSlug ? getSeriesBySlug(post.seriesSlug) : undefined

  // prev/next: 시리즈 포스트면 시리즈 순서 기준, 일반 포스트면 날짜 순 전체 기준
  let prev: PostMeta | null = null
  let next: PostMeta | null = null

  if (series) {
    const idx = series.posts.findIndex(p => p.slug === slug)
    const prevEntry = idx > 0 ? series.posts[idx - 1] : null
    const nextEntry = idx < series.posts.length - 1 ? series.posts[idx + 1] : null

    // SeriesPostEntry → PostMeta 최소 변환 (PrevNextNav에서 title, slug만 사용)
    if (prevEntry) {
      prev = { ...prevEntry, date: '', tags: [], description: '', draft: false, readingTime: '' }
    }
    if (nextEntry) {
      next = { ...nextEntry, date: '', tags: [], description: '', draft: false, readingTime: '' }
    }
  } else {
    const allPosts = getAllPosts()
    const currentIndex = allPosts.findIndex(p => p.slug === slug)
    prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
    next = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  }

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

      {series && <SeriesPanel series={series} currentSlug={slug} />}

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

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/posts/[slug]/page.tsx
git commit -m "feat: 포스트 페이지에 SeriesPanel 추가 및 시리즈 기반 prev/next 네비게이션 적용"
```

---

## Task 5: 시리즈 인덱스 페이지

**Files:**
- Create: `src/components/series/SeriesCard.tsx`
- Create: `src/app/series/page.tsx`
- Create: `src/app/series/[slug]/page.tsx`

- [ ] **Step 1: SeriesCard 구현**

`src/components/series/SeriesCard.tsx`:

```typescript
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SeriesMeta } from '@/lib/types'

interface SeriesCardProps {
  series: SeriesMeta
}

export function SeriesCard({ series }: SeriesCardProps) {
  return (
    <Link href={`/series/${series.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="text-lg">{series.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {series.posts.length}편
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
```

- [ ] **Step 2: 시리즈 목록 페이지 구현**

`src/app/series/page.tsx`:

```typescript
import { getAllSeries } from '@/lib/posts'
import { SeriesCard } from '@/components/series/SeriesCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '시리즈',
  description: '주제별로 묶은 연재 글 목록',
}

export default function SeriesIndexPage() {
  const series = getAllSeries()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">시리즈</h1>
      {series.length === 0 ? (
        <p className="text-muted-foreground">아직 시리즈가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {series.map(s => (
            <SeriesCard key={s.slug} series={s} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 시리즈 상세 페이지 구현**

`src/app/series/[slug]/page.tsx`:

```typescript
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllSeries, getSeriesBySlug } from '@/lib/posts'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const series = getAllSeries()
  return series.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const series = getSeriesBySlug(slug)
  if (!series) return {}
  return {
    title: series.name,
    description: `${series.name} 시리즈 — 총 ${series.posts.length}편`,
  }
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params
  const series = getSeriesBySlug(slug)

  if (!series) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{series.name}</h1>
      <p className="text-muted-foreground mb-8">총 {series.posts.length}편</p>

      <ol className="space-y-3">
        {series.posts.map((post, idx) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-muted-foreground text-sm w-6 shrink-0 pt-0.5">
                {idx + 1}.
              </span>
              <span className="font-medium">{post.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 4: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/components/series/SeriesCard.tsx src/app/series/page.tsx src/app/series/[slug]/page.tsx
git commit -m "feat: 시리즈 인덱스 페이지 및 SeriesCard 컴포넌트 구현"
```

---

## Task 6: 기존 포스트 frontmatter 업데이트

**Files:**
- Modify: `content/posts/2026-04-14-system-design-interview-01.mdx`

- [ ] **Step 1: seriesSlug 필드 추가**

`content/posts/2026-04-14-system-design-interview-01.mdx` frontmatter를:

```yaml
---
title: "대규모 시스템 설계 스터디 01 — 1명에서 수백만 명까지"
date: "2026-04-14"
tags: ["system-design", "scalability", "distributed-systems", "study", "backend"]
description: "서버 1대에서 수백만 사용자까지 — 아키텍처가 어떻게 진화하는지 1장 핵심 정리"
draft: false
series: "대규모 시스템 설계 스터디"
seriesSlug: "system-design-interview"
seriesOrder: 1
---
```

으로 변경 (`seriesSlug: "system-design-interview"` 추가).

- [ ] **Step 2: 빌드 확인**

```bash
npx next build 2>&1 | tail -20
```

Expected: 빌드 성공, `/series`, `/series/system-design-interview` 페이지 생성 확인

- [ ] **Step 3: 전체 테스트 실행**

```bash
npx vitest run
```

Expected: 전체 PASS

- [ ] **Step 4: 커밋**

```bash
git add content/posts/2026-04-14-system-design-interview-01.mdx
git commit -m "feat: system-design-interview-01 frontmatter에 seriesSlug 추가"
```

---

## Self-Review

### Spec Coverage

| 스펙 요구사항 | 커버 태스크 |
|-------------|------------|
| frontmatter 기반 시리즈 메타 | Task 1, 2, 6 |
| 상단 접이식 SeriesPanel | Task 3, 4 |
| draft 포스트 SeriesPanel에서 숨김 | Task 2 (getAllSeries가 getAllPosts 호출 — draft 이미 제외) |
| 시리즈 포스트에서 PrevNextNav 시리즈 순서 기준 | Task 4 |
| /series 인덱스 페이지 | Task 5 |
| /series/[slug] 시리즈 상세 페이지 | Task 5 |
| seriesOrder 중복 경고 | Task 2 (getAllSeries 내 warn) |
| seriesOrder 없을 때 date fallback | Task 2 (getAllSeries 내 정렬) |
| generateStaticParams | Task 5 |

### Type Consistency

- `SeriesPostEntry`: Task 1에서 정의 → Task 2, 3, 4에서 동일하게 사용 ✅
- `SeriesMeta`: Task 1에서 정의 → Task 2, 3, 4, 5에서 동일하게 사용 ✅
- `getSeriesBySlug` 반환: `SeriesMeta | undefined` → Task 2 구현과 Task 4 사용부 일치 ✅
- `getAllSeries` 반환: `SeriesMeta[]` → Task 2 구현과 Task 5 사용부 일치 ✅
