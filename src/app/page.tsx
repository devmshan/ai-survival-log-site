import { getAllPosts, getAllTags } from '@/lib/posts'
import { PostList } from '@/components/post/PostList'
import { TagFilter } from '@/components/post/TagFilter'
import { Suspense } from 'react'

export default function HomePage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">devsurvivallog</h1>
        <p className="text-muted-foreground">AI로 수렴하고, 나의 언어로 발산하는 공간</p>
      </div>
      <Suspense>
        <TagFilter tags={tags} />
      </Suspense>
      <PostList posts={posts} />
    </div>
  )
}
