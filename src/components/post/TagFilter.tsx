'use client'

import { useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getFeaturedTags, getTagHref } from '@/lib/tag-navigation'
import { ChevronDownIcon, SearchIcon } from 'lucide-react'

interface TagFilterProps {
  tags: string[]
  selectedTag?: string
}

export function TagFilter({ tags, selectedTag }: TagFilterProps) {
  const [query, setQuery] = useState('')
  const searchId = useId()
  const featuredTags = getFeaturedTags(tags)
  const selectedIsFeatured = selectedTag ? featuredTags.includes(selectedTag) : false
  const normalizedQuery = query.trim().toLowerCase()

  const filteredTags = useMemo(() => {
    if (!normalizedQuery) return tags
    return tags.filter(tag => tag.toLowerCase().includes(normalizedQuery))
  }, [normalizedQuery, tags])

  return (
    <nav aria-label="태그 탐색" className="mb-6 space-y-3">
      <div role="group" aria-label="대표 태그" className="flex min-w-0 flex-wrap gap-2">
        <TagLink href="/" label="전체" selected={!selectedTag} />
        {featuredTags.map(tag => (
          <TagLink
            key={tag}
            href={getTagHref(tag)}
            label={tag}
            selected={tag === selectedTag}
          />
        ))}
      </div>

      {selectedTag && !selectedIsFeatured && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>현재 태그</span>
          <TagLink href={getTagHref(selectedTag)} label={selectedTag} selected />
        </div>
      )}

      <details className="group rounded-lg border border-border/70 bg-muted/20 p-3 open:bg-muted/30">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 items-center gap-2 overflow-hidden">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span>태그 찾기</span>
          </span>
          <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">전체 {tags.length}개</span>
            <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </span>
        </summary>

        <div className="mt-3 space-y-3">
          <label htmlFor={searchId} className="sr-only">태그 검색</label>
          <Input
            id={searchId}
            type="search"
            placeholder="태그 검색"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <div className="max-h-56 overflow-y-auto pr-1">
            {filteredTags.length > 0 ? (
              <div role="group" aria-label="전체 태그" className="flex flex-wrap gap-2">
                {filteredTags.map(tag => (
                  <TagLink
                    key={tag}
                    href={getTagHref(tag)}
                    label={tag}
                    selected={tag === selectedTag}
                    compact
                  />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                일치하는 태그가 없습니다.
              </p>
            )}
          </div>
        </div>
      </details>
    </nav>
  )
}

interface TagLinkProps {
  href: string
  label: string
  selected?: boolean
  compact?: boolean
}

function TagLink({ href, label, selected = false, compact = false }: TagLinkProps) {
  return (
    <Link
      href={href}
      title={label}
      aria-current={selected ? 'page' : undefined}
      className="inline-flex max-w-full shrink-0 rounded-4xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Badge
        variant={selected ? 'default' : 'outline'}
        className={cn(
          'h-8 max-w-[14rem] justify-start truncate px-3 text-sm',
          compact && 'h-7 max-w-[12rem] px-2 text-xs'
        )}
      >
        {label}
      </Badge>
    </Link>
  )
}
