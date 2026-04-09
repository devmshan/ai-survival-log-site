import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PostMeta } from '@/lib/types'

interface PrevNextNavProps {
  prev: PostMeta | null
  next: PostMeta | null
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  return (
    <div className="flex justify-between mt-12 pt-8 border-t">
      {prev ? (
        <Link href={`/posts/${prev.slug}`} className="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground max-w-[45%]">
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{prev.title}</span>
        </Link>
      ) : <div />}
      {next ? (
        <Link href={`/posts/${next.slug}`} className="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground max-w-[45%] text-right">
          <span className="line-clamp-1">{next.title}</span>
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Link>
      ) : <div />}
    </div>
  )
}
