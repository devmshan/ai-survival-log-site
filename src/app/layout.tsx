import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getAllPosts } from '@/lib/posts'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchProvider } from '@/contexts/SearchContext'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'devsurvivallog',
    template: '%s | devsurvivallog',
  },
  description: '개인 블로그 & AI 학습 기록',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllPosts()

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SearchProvider>
            <div className="min-h-screen flex flex-col">
              <SearchBar posts={posts} />
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                {children}
              </main>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
