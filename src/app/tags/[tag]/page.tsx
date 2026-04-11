import { notFound } from 'next/navigation'
import { getAllTags, getPostsByTag } from '@/lib/posts'
import { PostList } from '@/components/post/PostList'
import { TagFilter } from '@/components/post/TagFilter'
import { Suspense } from 'react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map(tag => ({ tag: encodeURIComponent(tag) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  return { title: `#${decodedTag}` }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const allTags = getAllTags()

  if (!allTags.includes(decodedTag)) notFound()

  const posts = getPostsByTag(decodedTag)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">#{decodedTag}</h1>
      <Suspense>
        <TagFilter tags={allTags} selectedTag={decodedTag} />
      </Suspense>
      <PostList posts={posts} />
    </div>
  )
}
