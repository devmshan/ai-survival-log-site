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
import { searchPosts } from '@/lib/search'
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

  const results = searchPosts(posts, query).slice(0, MAX_RESULTS)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const nextOpen = !open
        if (!nextOpen) setQuery('')
        setOpen(nextOpen)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, setOpen])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setQuery('')
    setOpen(nextOpen)
  }

  function handleSelect(slug: string) {
    handleOpenChange(false)
    router.push(`/posts/${slug}`)
  }

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange} shouldFilter={false}>
      <CommandInput
        placeholder="글 검색..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading="포스트">
            {results.map(post => (
              <CommandItem
                key={post.slug}
                value={post.slug}
                onSelect={() => handleSelect(post.slug)}
              >
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.description}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
