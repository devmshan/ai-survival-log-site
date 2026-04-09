'use client'

import { useEffect, useState } from 'react'
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
import type { PostMeta } from '@/lib/types'

interface SearchBarProps {
  posts: PostMeta[]
}

export function SearchBar({ posts }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  const fuse = createSearchIndex(posts)
  const results = query ? fuse.search(query).slice(0, 8) : []

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
