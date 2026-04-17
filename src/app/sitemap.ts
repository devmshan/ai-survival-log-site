import type { MetadataRoute } from 'next'
import { getAllPosts, getAllSeries, getAllTags } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'

function getLatestDate(dates: string[]): Date {
  const timestamps = dates
    .map(date => new Date(date))
    .filter(date => !Number.isNaN(date.getTime()))
    .map(date => date.getTime())

  if (timestamps.length === 0) return new Date()
  return new Date(Math.max(...timestamps))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const tags = getAllTags()
  const series = getAllSeries()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: getLatestDate(posts.map(post => post.date)),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/series'),
      lastModified: getLatestDate(posts.filter(post => post.seriesSlug).map(post => post.date)),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const tagRoutes: MetadataRoute.Sitemap = tags.map(tag => ({
    url: absoluteUrl(`/tags/${encodeURIComponent(tag)}`),
    lastModified: getLatestDate(getAllPosts().filter(post => post.tags.includes(tag)).map(post => post.date)),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const seriesRoutes: MetadataRoute.Sitemap = series.map(entry => ({
    url: absoluteUrl(`/series/${entry.slug}`),
    lastModified: getLatestDate(
      entry.posts
        .map(seriesPost => posts.find(post => post.slug === seriesPost.slug)?.date ?? '')
        .filter(Boolean)
    ),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...tagRoutes, ...seriesRoutes]
}
