'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Search, Menu, X } from 'lucide-react'
import { useSearch } from '@/contexts/SearchContext'
import { Logo } from './Logo'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { setOpen } = useSearch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 max-w-4xl h-14 flex items-center justify-between">
        <Link href="/" aria-label="devsurvivallog 홈">
          <Logo />
        </Link>

        {/* 데스크탑 nav */}
        <nav className="hidden md:flex items-center gap-4">
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

        {/* 모바일 햄버거 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="메뉴"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <button
              className="text-sm text-muted-foreground hover:text-foreground text-left flex items-center gap-2"
              onClick={() => { setOpen(true); setMobileMenuOpen(false) }}
            >
              <Search className="h-4 w-4" /> 검색
            </button>
            <button
              className="text-sm text-muted-foreground hover:text-foreground text-left flex items-center gap-2"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark'
                ? <><Sun className="h-4 w-4" /> 라이트 모드</>
                : <><Moon className="h-4 w-4" /> 다크 모드</>
              }
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
