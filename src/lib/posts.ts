import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Post, PostMeta, SeriesMeta, SeriesPostEntry } from './types'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))

  return files
    .map(filename => {
      const slug = filename.replace(/\.(mdx|md)$/, '')
      const filePath = path.join(POSTS_DIR, filename)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        tags: data.tags ?? [],
        description: data.description ?? '',
        thumbnail: data.thumbnail,
        draft: data.draft ?? false,
        readingTime: readingTime(content).text,
        series: data.series,
        seriesSlug: data.seriesSlug,
        seriesOrder: data.seriesOrder,
      } satisfies PostMeta
    })
    .filter(post => !post.draft)
    .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post {
  const extensions = ['mdx', 'md']
  let filePath = ''

  for (const ext of extensions) {
    const candidate = path.join(POSTS_DIR, `${slug}.${ext}`)
    if (fs.existsSync(candidate)) {
      filePath = candidate
      break
    }
  }

  if (!filePath) throw new Error(`Post not found: ${slug}`)

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    tags: data.tags ?? [],
    description: data.description ?? '',
    thumbnail: data.thumbnail,
    draft: data.draft ?? false,
    readingTime: readingTime(content).text,
    content,
    series: data.series,
    seriesSlug: data.seriesSlug,
    seriesOrder: data.seriesOrder,
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set(posts.flatMap(p => p.tags))
  return Array.from(tagSet).sort()
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter(p => p.tags.includes(tag))
}

export function getAllSeries(): SeriesMeta[] {
  const posts = getAllPosts()
  const seriesMap = new Map<string, { name: string; posts: PostMeta[] }>()

  for (const post of posts) {
    if (!post.series || !post.seriesSlug) continue

    if (!seriesMap.has(post.seriesSlug)) {
      seriesMap.set(post.seriesSlug, { name: post.series, posts: [] })
    }
    seriesMap.get(post.seriesSlug)!.posts.push(post)
  }

  return Array.from(seriesMap.entries()).map(([slug, { name, posts: seriesPosts }]) => {
    const orders = seriesPosts.map(p => p.seriesOrder).filter((o): o is number => o !== undefined)
    const hasDuplicates = new Set(orders).size !== orders.length
    if (hasDuplicates) {
      console.warn(`[series] seriesOrder 중복 감지: slug="${slug}" — date 기준 2차 정렬 적용`)
    }

    const sorted = [...seriesPosts]
      .filter(p => p.seriesOrder !== undefined)
      .sort((a, b) => {
        const orderA = a.seriesOrder!
        const orderB = b.seriesOrder!
        if (orderA !== orderB) return orderA - orderB
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })

    return {
      name,
      slug,
      posts: sorted.map((p): SeriesPostEntry => ({
        slug: p.slug,
        title: p.title,
        seriesOrder: p.seriesOrder!,
      })),
    }
  })
}

export function getSeriesBySlug(slug: string): SeriesMeta | undefined {
  return getAllSeries().find(s => s.slug === slug)
}
