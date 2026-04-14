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
