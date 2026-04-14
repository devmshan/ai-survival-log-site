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
