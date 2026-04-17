import { getAllSeries } from '@/lib/posts'
import { SeriesCard } from '@/components/series/SeriesCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '시리즈',
  description: '주제별로 묶은 연재 글 목록',
  alternates: {
    canonical: '/series',
  },
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
