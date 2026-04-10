'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Search } from 'lucide-react'
import { useSearch } from '@/contexts/SearchContext'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { setOpen } = useSearch()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          AI Survival Log
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="검색"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="테마 변경"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </nav>
      </div>
    </header>
  )
}
