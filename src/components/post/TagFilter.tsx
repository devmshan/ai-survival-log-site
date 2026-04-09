'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TagFilterProps {
  tags: string[]
  selectedTag?: string
}

export function TagFilter({ tags, selectedTag }: TagFilterProps) {
  const router = useRouter()

  function handleTagClick(tag: string) {
    if (tag === selectedTag) {
      router.push('/')
    } else {
      router.push(`/tags/${tag}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Badge
        variant={!selectedTag ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => router.push('/')}
      >
        전체
      </Badge>
      {tags.map(tag => (
        <Badge
          key={tag}
          variant={tag === selectedTag ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  )
}
