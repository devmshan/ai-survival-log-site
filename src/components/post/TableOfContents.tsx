/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import type { PostHeading } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'

interface TableOfContentsProps {
  headings: PostHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const headingsKey = headings.map(h => h.id).join('|')
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '')
  const tickingRef = useRef(false)

  useEffect(() => {
    // Keep state sane when navigating between posts
    if (headings.length > 0) setActiveId(headings[0].id)
    else setActiveId('')
  }, [headingsKey])

  useEffect(() => {
    if (headings.length === 0) return

    const container = document.getElementById('post-content')
    if (!container) return

    const headingEls = Array.from(container.querySelectorAll<HTMLElement>('h2[id], h3[id]'))
    if (headingEls.length === 0) return

    const offsetPx = 120

    const computeActive = () => {
      tickingRef.current = false

      let candidateId = headingEls[0]?.id ?? ''
      for (const el of headingEls) {
        const top = el.getBoundingClientRect().top
        if (top - offsetPx <= 0) candidateId = el.id
        else break
      }

      setActiveId(prev => (prev === candidateId ? prev : candidateId))
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(computeActive)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    // Initial highlight
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [headingsKey])

  if (headings.length === 0) return null

  return (
    <nav className="rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm">
      <p className="mb-3 font-semibold tracking-tight">목차</p>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 12}px` }}>
            <a
              href={`#${h.id}`}
              onClick={() => setActiveId(h.id)}
              className={[
                'block rounded-md px-2 py-1 transition-colors',
                h.id === activeId
                  ? 'bg-background text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground',
              ].join(' ')}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
