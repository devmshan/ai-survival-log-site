export interface PostMeta {
  title: string
  date: string
  tags: string[]
  description: string
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
