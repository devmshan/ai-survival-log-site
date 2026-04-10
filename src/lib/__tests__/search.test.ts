import { describe, it, expect } from 'vitest'
import { createSearchIndex } from '../search'
import type { PostMeta } from '../types'

const MOCK_POSTS: PostMeta[] = [
  {
    slug: 'ai-survival-guide',
    title: 'AI Survival Guide',
    description: 'How to survive in the age of AI',
    tags: ['AI', 'productivity'],
    date: '2026-04-01',
    draft: false,
    readingTime: '3 min read',
  },
  {
    slug: 'react-patterns',
    title: 'React Patterns',
    description: 'Common patterns in React development',
    tags: ['react', 'frontend'],
    date: '2026-04-02',
    draft: false,
    readingTime: '5 min read',
  },
  {
    slug: 'typescript-tips',
    title: 'TypeScript Tips',
    description: 'Tips for better TypeScript code',
    tags: ['typescript'],
    date: '2026-04-03',
    draft: false,
    readingTime: '4 min read',
  },
]

describe('createSearchIndex', () => {
  it('제목으로 검색하면 일치하는 결과를 반환한다', () => {
    const fuse = createSearchIndex(MOCK_POSTS)
    const results = fuse.search('React')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.slug).toBe('react-patterns')
  })

  it('설명으로 검색하면 일치하는 결과를 반환한다', () => {
    const fuse = createSearchIndex(MOCK_POSTS)
    const results = fuse.search('survive')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.slug).toBe('ai-survival-guide')
  })

  it('태그로 검색하면 일치하는 결과를 반환한다', () => {
    const fuse = createSearchIndex(MOCK_POSTS)
    const results = fuse.search('typescript')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.slug).toBe('typescript-tips')
  })

  it('일치하는 결과가 없으면 빈 배열을 반환한다', () => {
    const fuse = createSearchIndex(MOCK_POSTS)
    const results = fuse.search('zzznotexistzzzzzz')
    expect(results).toEqual([])
  })

  it('빈 포스트 목록으로 인덱스를 생성할 수 있다', () => {
    const fuse = createSearchIndex([])
    const results = fuse.search('anything')
    expect(results).toEqual([])
  })
})
