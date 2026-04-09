'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    const content = document.getElementById('post-content')
    if (!content) return
    const elements = content.querySelectorAll('h2, h3')
    const items: Heading[] = Array.from(elements)
      .filter(el => !el.closest('.sr-only') && el.id)
      .map(el => ({
        id: el.id,
        text: el.textContent ?? '',
        level: parseInt(el.tagName[1]),
      }))
    setHeadings(items)
  }, [])

  if (headings.length === 0) return null

  return (
    <nav className="text-sm">
      <p className="font-semibold mb-2">목차</p>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 12}px` }}>
            <a
              href={`#${h.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
