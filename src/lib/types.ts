export interface PostMeta {
  title: string
  seoTitle?: string
  date: string
  tags: string[]
  description: string
  seoDescription?: string
  thumbnail?: string
  draft: boolean
  slug: string
  readingTime: string
  series?: string
  seriesSlug?: string
  seriesOrder?: number
}

export interface Post extends PostMeta {
  content: string
  headings: PostHeading[]
}

export interface SeriesPostEntry {
  slug: string
  title: string
  seriesOrder: number
}

export interface SeriesMeta {
  name: string
  slug: string
  posts: SeriesPostEntry[]
}

export interface PostHeading {
  id: string
  text: string
  level: 2 | 3
}
