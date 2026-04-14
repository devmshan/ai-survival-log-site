import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeriesCard } from '../SeriesCard'
import type { SeriesMeta } from '@/lib/types'

const mockSeries: SeriesMeta = {
  name: '대규모 시스템 설계 스터디',
  slug: 'system-design-interview',
  posts: [
    { slug: 'series-01', title: '1편', seriesOrder: 1 },
    { slug: 'series-02', title: '2편', seriesOrder: 2 },
    { slug: 'series-03', title: '3편', seriesOrder: 3 },
  ],
}

describe('SeriesCard', () => {
  it('시리즈 이름을 렌더링한다', () => {
    render(<SeriesCard series={mockSeries} />)
    expect(screen.getByText('대규모 시스템 설계 스터디')).toBeInTheDocument()
  })

  it('포스트 수를 렌더링한다', () => {
    render(<SeriesCard series={mockSeries} />)
    expect(screen.getByText('3편')).toBeInTheDocument()
  })

  it('/series/slug 링크로 감싸져 있다', () => {
    render(<SeriesCard series={mockSeries} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/series/system-design-interview')
  })
})
