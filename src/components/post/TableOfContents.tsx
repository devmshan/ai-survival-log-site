'use client'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const headings: Heading[] = typeof document === 'undefined'
    ? []
    : Array.from(document.getElementById('post-content')?.querySelectorAll('h2, h3') ?? [])
        .filter(el => !el.closest('.sr-only') && el.id)
        .map(el => ({
          id: el.id,
          text: el.textContent ?? '',
          level: parseInt(el.tagName[1]),
        }))

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
