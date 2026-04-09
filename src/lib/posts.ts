import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Post, PostMeta } from './types'

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
      } satisfies PostMeta
    })
    .filter(post => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
