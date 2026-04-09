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
        <h1 className="text-3xl font-bold mb-2">AI Survival Log</h1>
        <p className="text-muted-foreground">개인 블로그 & AI 학습 기록</p>
      </div>
      <Suspense>
        <TagFilter tags={tags} />
      </Suspense>
      <PostList posts={posts} />
    </div>
  )
}
