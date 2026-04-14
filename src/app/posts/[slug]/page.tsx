import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { getAllPosts, getPostBySlug, getSeriesBySlug } from '@/lib/posts'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import { TableOfContents } from '@/components/post/TableOfContents'
import { PrevNextNav } from '@/components/post/PrevNextNav'
import { GiscusComments } from '@/components/post/GiscusComments'
import { ViewTracker } from '@/components/post/ViewTracker'
import { SeriesPanel } from '@/components/post/SeriesPanel'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'
import type { PostMeta } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return {
    title: post.series ? `${post.title} — ${post.series}` : post.title,
    description: post.description,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  let post
  try {
    post = getPostBySlug(slug)
  } catch {
    notFound()
  }

  const series = post.seriesSlug ? getSeriesBySlug(post.seriesSlug) : undefined

  // prev/next: 시리즈 포스트면 시리즈 순서 기준, 일반 포스트면 날짜 순 전체 기준
  let prev: PostMeta | null = null
  let next: PostMeta | null = null

  if (series) {
    const idx = series.posts.findIndex(p => p.slug === slug)
    const prevEntry = idx > 0 ? series.posts[idx - 1] : null
    const nextEntry = idx < series.posts.length - 1 ? series.posts[idx + 1] : null

    // SeriesPostEntry → PostMeta 최소 변환 (PrevNextNav에서 title, slug만 사용)
    if (prevEntry) {
      prev = { ...prevEntry, date: '', tags: [], description: '', draft: false, readingTime: '' }
    }
    if (nextEntry) {
      next = { ...nextEntry, date: '', tags: [], description: '', draft: false, readingTime: '' }
    }
  } else {
    const allPosts = getAllPosts()
    const currentIndex = allPosts.findIndex(p => p.slug === slug)
    prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
    next = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  }

  return (
    <article>
      <ViewTracker slug={slug} />
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      {series && <SeriesPanel series={series} currentSlug={slug} />}

      <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-8">
        <div id="post-content" className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
          />
        </div>
        <aside className="hidden lg:block sticky top-8 h-fit">
          <TableOfContents />
        </aside>
      </div>

      <PrevNextNav prev={prev} next={next} />
      <GiscusComments />
    </article>
  )
}
