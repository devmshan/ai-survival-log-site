import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllPosts, getPostBySlug, getAllTags, getPostsByTag, getAllSeries, getSeriesBySlug } from '../posts'

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
date: 2026-04-01
tags: [AI, react]
description: First description
draft: false
---
# Hello World

Some content here.
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
    expect(post.content).toBeTruthy()
  })

  it('존재하지 않는 slug면 에러를 던진다', async () => {
    const fs = (await import('fs')).default
    vi.mocked(fs.existsSync).mockReturnValue(false)
    expect(() => getPostBySlug('not-exist')).toThrow('Post not found: not-exist')
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
