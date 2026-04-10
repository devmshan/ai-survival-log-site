import type { PostMeta } from './types'

export function searchPosts(posts: PostMeta[], query: string): PostMeta[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return posts.filter(post => {
    return (
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.tags.some(tag => tag.toLowerCase().includes(q))
    )
  })
}
