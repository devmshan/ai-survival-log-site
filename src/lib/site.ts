const DEFAULT_SITE_URL = 'https://ai-survival-log-site.vercel.app'
const DEFAULT_OG_IMAGE = '/images/yacht-sailing.jpg'

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL
  if (!envUrl) return DEFAULT_SITE_URL

  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl
}

export function absoluteUrl(pathname = '/'): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${getSiteUrl()}${normalizedPath}`
}

export function getDefaultOgImage(): string {
  return absoluteUrl(DEFAULT_OG_IMAGE)
}

export function resolveSiteAssetUrl(pathname?: string): string {
  if (!pathname) return getDefaultOgImage()
  if (/^https?:\/\//.test(pathname)) return pathname
  return absoluteUrl(pathname)
}
