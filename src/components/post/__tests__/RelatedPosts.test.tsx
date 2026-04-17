import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RelatedPosts } from '../RelatedPosts'
import type { PostMeta } from '@/lib/types'

const relatedPosts: PostMeta[] = [
  {
    slug: 'llm-basics',
    title: 'LLM 기초 정리',
    seoTitle: 'LLM 기초 정리',
    date: '2026-04-14',
    tags: ['llm', 'ai'],
    description: 'LLM 기본 개념을 정리한 글',
    seoDescription: 'LLM 기본 개념을 정리한 글',
    draft: false,
    readingTime: '5 min read',
  },
]

describe('RelatedPosts', () => {
  it('관련 글 목록을 렌더링한다', () => {
    render(<RelatedPosts posts={relatedPosts} />)
    expect(screen.getByText('관련 글')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /LLM 기초 정리/ })).toHaveAttribute('href', '/posts/llm-basics')
  })

  it('관련 글이 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<RelatedPosts posts={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
