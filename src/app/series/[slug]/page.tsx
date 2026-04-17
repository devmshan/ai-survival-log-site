import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllSeries, getSeriesBySlug } from '@/lib/posts'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const series = getAllSeries()
  return series.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const series = getSeriesBySlug(slug)
  if (!series) return {}
  return {
    title: series.name,
    description: `${series.name} 시리즈 — 총 ${series.posts.length}편`,
    alternates: {
      canonical: `/series/${series.slug}`,
    },
  }
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params
  const series = getSeriesBySlug(slug)

  if (!series) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{series.name}</h1>
      <p className="text-muted-foreground mb-8">총 {series.posts.length}편</p>

      <ol className="space-y-3 list-none">
        {series.posts.map((post, idx) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-muted-foreground text-sm w-6 shrink-0 pt-0.5">
                {idx + 1}.
              </span>
              <span className="font-medium">{post.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
