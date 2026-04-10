'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { createSearchIndex } from '@/lib/search'
import { useSearch } from '@/contexts/SearchContext'
import type { PostMeta } from '@/lib/types'

const MAX_RESULTS = 8

interface SearchBarProps {
  posts: PostMeta[]
}

export function SearchBar({ posts }: SearchBarProps) {
  const { open, setOpen } = useSearch()
  const [query, setQuery] = useState('')
  const router = useRouter()

  const fuse = useMemo(() => createSearchIndex(posts), [posts])
  const results = query ? fuse.search(query).slice(0, MAX_RESULTS) : []

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setOpen])

  function handleSelect(slug: string) {
    setOpen(false)
    router.push(`/posts/${slug}`)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="글 검색..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading="포스트">
            {results.map(({ item }) => (
              <CommandItem
                key={item.slug}
                value={item.slug}
                onSelect={() => handleSelect(item.slug)}
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
