import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { PostMeta } from '@/lib/types'

interface RelatedPostsProps {
  posts: PostMeta[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12 border-t pt-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">관련 글</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          같은 주제를 이어서 읽을 수 있는 글입니다.
        </p>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <article key={post.slug} className="rounded-lg border p-4 transition-colors hover:bg-muted/40">
            <div className="mb-2 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <Link href={`/posts/${post.slug}`} className="block">
              <h3 className="font-medium hover:underline">{post.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
              <div className="mt-3 text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span className="mx-2">·</span>
                <span>{post.readingTime}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
