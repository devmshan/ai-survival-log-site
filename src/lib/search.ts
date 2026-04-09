import Fuse from 'fuse.js'
import type { PostMeta } from './types'

export function createSearchIndex(posts: PostMeta[]) {
  return new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.1 },
    ],
    threshold: 0.4,
  })
}
