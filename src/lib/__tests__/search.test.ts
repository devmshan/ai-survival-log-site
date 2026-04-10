import { describe, it, expect } from 'vitest'
import { searchPosts } from '../search'
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
  {
    slug: 'korean-post',
    title: '요트 경주에 뒤늦게 올라탄 개발자의 항해일지',
    description: 'AI 시대는 요트 경주다',
    tags: ['AI', '회고'],
    date: '2026-04-10',
    draft: false,
    readingTime: '5 min read',
  },
]

describe('searchPosts', () => {
  it('제목으로 검색하면 일치하는 결과를 반환한다', () => {
    const results = searchPosts(MOCK_POSTS, 'React')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].slug).toBe('react-patterns')
  })

  it('설명으로 검색하면 일치하는 결과를 반환한다', () => {
    const results = searchPosts(MOCK_POSTS, 'survive')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].slug).toBe('ai-survival-guide')
  })

  it('태그로 검색하면 일치하는 결과를 반환한다', () => {
    const results = searchPosts(MOCK_POSTS, 'typescript')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].slug).toBe('typescript-tips')
  })

  it('한국어 제목으로 검색하면 일치하는 결과를 반환한다', () => {
    const results = searchPosts(MOCK_POSTS, '요트')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].slug).toBe('korean-post')
  })

  it('한국어 부분 검색이 동작한다', () => {
    const results = searchPosts(MOCK_POSTS, '개발자')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].slug).toBe('korean-post')
  })

  it('대소문자 구분 없이 검색된다', () => {
    const results = searchPosts(MOCK_POSTS, 'react')
    expect(results.length).toBeGreaterThan(0)
  })

  it('일치하는 결과가 없으면 빈 배열을 반환한다', () => {
    const results = searchPosts(MOCK_POSTS, 'zzznotexistzzzzzz')
    expect(results).toEqual([])
  })

  it('빈 쿼리는 빈 배열을 반환한다', () => {
    const results = searchPosts(MOCK_POSTS, '')
    expect(results).toEqual([])
  })

  it('공백만 있는 쿼리는 빈 배열을 반환한다', () => {
    const results = searchPosts(MOCK_POSTS, '   ')
    expect(results).toEqual([])
  })
})
