import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllPosts, getPostBySlug, getAllTags, getPostsByTag } from '../posts'

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
