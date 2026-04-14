import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { SeriesMeta } from '@/lib/types'

interface SeriesPanelProps {
  series: SeriesMeta
  currentSlug: string
}

export function SeriesPanel({ series, currentSlug }: SeriesPanelProps) {
  const currentIndex = series.posts.findIndex(p => p.slug === currentSlug)
  const displayIndex = Math.max(0, currentIndex)

  return (
    <details className="border rounded-lg p-4 mb-8 bg-muted/30">
      <summary className="cursor-pointer flex items-center gap-2 font-medium list-none">
        <Badge variant="secondary">
          {displayIndex + 1}/{series.posts.length}편
        </Badge>
        <span>{series.name}</span>
      </summary>
      <ol className="mt-4 space-y-2 pl-1 list-none">
        {series.posts.map((post, idx) => (
          <li key={post.slug} className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground w-4 shrink-0">{idx + 1}.</span>
            {post.slug === currentSlug ? (
              <span className="font-semibold text-foreground">{post.title}</span>
            ) : (
              <Link
                href={`/posts/${post.slug}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {post.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </details>
  )
}
