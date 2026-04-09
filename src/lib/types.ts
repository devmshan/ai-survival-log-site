export interface PostMeta {
  title: string
  date: string
  tags: string[]
  description: string
  thumbnail?: string
  draft: boolean
  slug: string
  readingTime: string
}

export interface Post extends PostMeta {
  content: string
}
