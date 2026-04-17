import { describe, it, expect, vi, beforeEach } from 'vitest'
import { extractHeadings, getAllPosts, getPostBySlug, getAllTags, getPostsByTag, getAllSeries, getSeriesBySlug, getRelatedPosts } from '../posts'

// fs 모킹
vi.mock('fs', () => ({
  default: {
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
}))

const MOCK_MDX_1 = `---
title: First Post
seoTitle: First Post for Search
date: 2026-04-01
tags: [AI, react]
description: First description
seoDescription: First description for search
thumbnail: /images/yacht-sailing.jpg
draft: false
---
# Hello World

Some content here.

## Section One

### Nested Point
`

const MOCK_MDX_2 = `---
title: Second Post
date: 2026-04-02
tags: [AI]
description: Second description
draft: false
---
# Second post content
`

const MOCK_DRAFT = `---
title: Draft Post
date: 2026-04-03
tags: [draft]
description: Draft description
draft: true
---
# Draft content
`

describe('getAllPosts', () => {
  beforeEach(async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue(['first-post.mdx', 'second-post.mdx', 'draft-post.mdx'] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('first-post')) return MOCK_MDX_1
      if (String(filePath).includes('second-post')) return MOCK_MDX_2
      return MOCK_DRAFT
    })
  })

  it('draft 포스트를 제외하고 반환한다', async () => {
    const posts = getAllPosts()
    expect(posts.every(p => !p.draft)).toBe(true)
  })

  it('날짜 내림차순으로 정렬한다', async () => {
    const posts = getAllPosts()
    expect(posts[0].title).toBe('Second Post')
    expect(posts[1].title).toBe('First Post')
  })

  it('slug가 파일명에서 확장자를 제거한 값이다', async () => {
    const posts = getAllPosts()
    expect(posts.map(p => p.slug)).toContain('first-post')
    expect(posts.map(p => p.slug)).toContain('second-post')
  })

  it('readingTime 필드가 포함된다', async () => {
    const posts = getAllPosts()
    expect(posts[0].readingTime).toBeTruthy()
  })

  it('optional SEO 필드를 파싱한다', async () => {
    const posts = getAllPosts()
    const firstPost = posts.find(post => post.slug === 'first-post')
    expect(firstPost?.seoTitle).toBe('First Post for Search')
    expect(firstPost?.seoDescription).toBe('First description for search')
    expect(firstPost?.thumbnail).toBe('/images/yacht-sailing.jpg')
  })

  it('.md 확장자도 처리한다', async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue(['md-post.md'] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockReturnValue(MOCK_MDX_1)
    const posts = getAllPosts()
    expect(posts[0].slug).toBe('md-post')
  })
})

describe('getPostBySlug', () => {
  beforeEach(async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.existsSync).mockImplementation((filePath: unknown) =>
      String(filePath).endsWith('first-post.mdx')
    )
    vi.mocked(fs.readFileSync).mockReturnValue(MOCK_MDX_1)
  })

  it('slug에 해당하는 포스트를 반환한다', async () => {
    const post = getPostBySlug('first-post')
    expect(post.title).toBe('First Post')
    expect(post.seoTitle).toBe('First Post for Search')
    expect(post.seoDescription).toBe('First description for search')
    expect(post.content).toBeTruthy()
    expect(post.headings).toEqual([
      { id: 'section-one', text: 'Section One', level: 2 },
      { id: 'nested-point', text: 'Nested Point', level: 3 },
    ])
  })

  it('존재하지 않는 slug면 에러를 던진다', async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.existsSync).mockReturnValue(false)
    expect(() => getPostBySlug('not-exist')).toThrow('Post not found: not-exist')
  })
})

describe('extractHeadings', () => {
  it('h2, h3만 추출하고 코드 블록 내부 헤딩은 무시한다', () => {
    const headings = extractHeadings(`
# Title

## First Topic

\`\`\`md
## Hidden Topic
\`\`\`

### Follow Up
`)

    expect(headings).toEqual([
      { id: 'first-topic', text: 'First Topic', level: 2 },
      { id: 'follow-up', text: 'Follow Up', level: 3 },
    ])
  })

  it('중복 헤딩에는 고유 id를 부여한다', () => {
    const headings = extractHeadings(`
## Repeat
## Repeat
`)

    expect(headings).toEqual([
      { id: 'repeat', text: 'Repeat', level: 2 },
      { id: 'repeat-1', text: 'Repeat', level: 2 },
    ])
  })
})

describe('getAllTags', () => {
  beforeEach(async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue(['first-post.mdx', 'second-post.mdx'] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('first-post')) return MOCK_MDX_1
      return MOCK_MDX_2
    })
  })

  it('중복 없이 정렬된 태그 목록을 반환한다', async () => {
    const tags = getAllTags()
    expect(tags).toEqual(['AI', 'react'])
    expect(new Set(tags).size).toBe(tags.length)
  })
})

describe('getPostsByTag', () => {
  beforeEach(async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue(['first-post.mdx', 'second-post.mdx'] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('first-post')) return MOCK_MDX_1
      return MOCK_MDX_2
    })
  })

  it('태그가 일치하는 포스트만 반환한다', async () => {
    const posts = getPostsByTag('react')
    expect(posts.length).toBe(1)
    expect(posts[0].title).toBe('First Post')
  })

  it('존재하지 않는 태그면 빈 배열을 반환한다', async () => {
    const posts = getPostsByTag('nonexistent')
    expect(posts).toEqual([])
  })
})

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

const MOCK_SERIES_NO_ORDER = `---
title: 시리즈 순서 없는 포스트
date: 2026-04-15
tags: [system-design]
description: 순서 없음 설명
draft: false
series: "대규모 시스템 설계 스터디"
seriesSlug: "system-design-interview"
---
# 순서 없는 본문
`

const MOCK_RELATED_BASE = `---
title: 현재 글
date: 2026-04-10
tags: [AI, rag]
description: 현재 글 설명
draft: false
series: "AI 구조"
seriesSlug: "ai-architecture"
seriesOrder: 1
---
# 현재 글
`

const MOCK_RELATED_SERIES = `---
title: 같은 시리즈 글
date: 2026-04-11
tags: [llm]
description: 같은 시리즈 글 설명
draft: false
series: "AI 구조"
seriesSlug: "ai-architecture"
seriesOrder: 2
---
# 같은 시리즈 글
`

const MOCK_RELATED_TAG_HEAVY = `---
title: 태그 겹침 많은 글
date: 2026-04-12
tags: [AI, rag, vector-db]
description: 태그 겹침 글 설명
draft: false
---
# 태그 겹침 많은 글
`

const MOCK_RELATED_TAG_LIGHT = `---
title: 태그 하나 겹치는 글
date: 2026-04-09
tags: [AI, productivity]
description: 태그 하나 겹침 글 설명
draft: false
---
# 태그 하나 겹치는 글
`

const MOCK_UNRELATED = `---
title: 무관한 글
date: 2026-04-13
tags: [career]
description: 무관한 글 설명
draft: false
---
# 무관한 글
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
    const series = getAllSeries()
    expect(series).toHaveLength(1)
    expect(series[0].posts).toHaveLength(2)
  })

  it('seriesOrder 순으로 정렬된 posts를 반환한다', () => {
    const series = getAllSeries()
    expect(series[0].posts[0].title).toBe('시리즈 1편')
    expect(series[0].posts[1].title).toBe('시리즈 2편')
  })

  it('SeriesPostEntry에는 slug, title, seriesOrder만 포함된다', () => {
    const series = getAllSeries()
    const entry = series[0].posts[0]
    expect(entry).toEqual({ slug: 'series-01', title: '시리즈 1편', seriesOrder: 1 })
  })

  it('name과 slug를 올바르게 반환한다', () => {
    const series = getAllSeries()
    expect(series[0].name).toBe('대규모 시스템 설계 스터디')
    expect(series[0].slug).toBe('system-design-interview')
  })

  it('seriesOrder가 없는 포스트는 시리즈에서 제외되고 warn이 출력된다', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue([
      'series-01.mdx',
      'series-no-order.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('series-01')) return MOCK_SERIES_1
      return MOCK_SERIES_NO_ORDER
    })

    const series = getAllSeries()

    expect(series[0].posts).toHaveLength(1)
    expect(series[0].posts[0].slug).toBe('series-01')
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('seriesOrder 누락 포스트 발견')
    )
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('series-no-order')
    )

    warnSpy.mockRestore()
  })

  it('series는 있고 seriesSlug가 없으면 에러를 던진다', async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue([
      'series-no-slug.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockReturnValue(`---
title: 슬러그 없는 포스트
date: 2026-04-10
tags: []
description: 설명
draft: false
series: "대규모 시스템 설계 스터디"
seriesOrder: 1
---
# 본문
`)
    expect(() => getAllSeries()).toThrow('seriesSlug 누락')
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
    const series = getSeriesBySlug('system-design-interview')
    expect(series).toBeDefined()
    expect(series!.name).toBe('대규모 시스템 설계 스터디')
  })

  it('존재하지 않는 slug면 undefined를 반환한다', () => {
    const series = getSeriesBySlug('not-exist')
    expect(series).toBeUndefined()
  })
})

describe('getRelatedPosts', () => {
  beforeEach(async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue([
      'current-post.mdx',
      'same-series.mdx',
      'tag-heavy.mdx',
      'tag-light.mdx',
      'unrelated.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('current-post')) return MOCK_RELATED_BASE
      if (String(filePath).includes('same-series')) return MOCK_RELATED_SERIES
      if (String(filePath).includes('tag-heavy')) return MOCK_RELATED_TAG_HEAVY
      if (String(filePath).includes('tag-light')) return MOCK_RELATED_TAG_LIGHT
      return MOCK_UNRELATED
    })
  })

  it('현재 글을 제외하고 관련도 순으로 반환한다', () => {
    const related = getRelatedPosts('current-post')
    expect(related.map(post => post.slug)).toEqual(['same-series', 'tag-heavy', 'tag-light'])
  })

  it('관련도가 없는 글은 제외한다', () => {
    const related = getRelatedPosts('current-post')
    expect(related.some(post => post.slug === 'unrelated')).toBe(false)
  })

  it('limit 인자를 적용한다', () => {
    const related = getRelatedPosts('current-post', 2)
    expect(related).toHaveLength(2)
  })
})
