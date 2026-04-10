import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getAllPosts } from '@/lib/posts'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchProvider } from '@/contexts/SearchContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AI Survival Log',
    template: '%s | AI Survival Log',
  },
  description: '개인 블로그 & AI 학습 기록',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllPosts()

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
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
