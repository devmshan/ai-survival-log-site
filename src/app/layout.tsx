import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getAllPosts } from '@/lib/posts'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchProvider } from '@/contexts/SearchContext'
import { getSiteUrl } from '@/lib/site'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-body',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-code',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'devsurvivallog',
    template: '%s | devsurvivallog',
  },
  description: 'AI로 수렴하고, 나의 언어로 발산하는 개발자 학습 로그',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'devsurvivallog',
    title: 'devsurvivallog',
    description: 'AI로 수렴하고, 나의 언어로 발산하는 개발자 학습 로그',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'devsurvivallog',
    description: 'AI로 수렴하고, 나의 언어로 발산하는 개발자 학습 로그',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllPosts()

  return (
    <html lang="ko" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SearchProvider>
            <div className="min-h-screen flex flex-col">
              <SearchBar posts={posts} />
              <Header />
              <main className="container mx-auto flex-1 px-4 py-8 max-w-6xl">
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
