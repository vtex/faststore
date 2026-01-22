import { NextResponse, type NextRequest } from 'next/server'
import storeConfig from 'discovery.config'
import type { LocalesSettings } from 'src/typings/locales'

type RewriteRule = {
  regex: RegExp
  locale: string
  hostname?: string
}

function isValidLocale(locale: string): boolean {
  if (!storeConfig.localization?.enabled) {
    return false
  }

  return locale in (storeConfig.localization.locales || {})
}

function isCustomPath(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname

    if (pathname === '/' || pathname === '') {
      return false
    }

    const canonicalPathPattern = /^\/[a-z]{2}-[A-Z]{2}\/?$/i
    if (canonicalPathPattern.test(pathname)) {
      return false
    }

    return true
  } catch {
    return false
  }
}

function generateRewriteRules(): RewriteRule[] {
  const rules: RewriteRule[] = []

  if (!storeConfig.localization?.enabled) {
    return rules
  }

  const locales = (storeConfig.localization.locales ||
    {}) as LocalesSettings['locales']

  for (const [localeCode, localeConfig] of Object.entries(locales)) {
    if (!localeConfig?.bindings || !Array.isArray(localeConfig.bindings)) {
      continue
    }

    for (const binding of localeConfig.bindings) {
      if (!binding.url) {
        continue
      }

      if (!isCustomPath(binding.url)) {
        continue
      }

      try {
        const bindingUrl = new URL(binding.url)
        const pathname = bindingUrl.pathname

        if (!pathname || pathname === '/') {
          continue
        }

        const escapedPath = pathname
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\/$/, '')

        const regex = new RegExp(`^${escapedPath}(?:\\/(.*))?$`, 'i')

        rules.push({
          regex,
          locale: localeCode,
          hostname: bindingUrl.hostname,
        })
      } catch {
        continue
      }
    }
  }

  return rules.sort((a, b) => {
    const aLength = a.regex.source.length
    const bLength = b.regex.source.length
    return bLength - aLength
  })
}

const rewriteRules = generateRewriteRules()

export function middleware(request: NextRequest) {
  if (!storeConfig.localization?.enabled) {
    return NextResponse.next()
  }

  const { pathname, search, hostname } = request.nextUrl

  for (const rule of rewriteRules) {
    if (rule.hostname && rule.hostname !== hostname) {
      continue
    }

    const match = pathname.match(rule.regex)
    if (!match) continue

    if (!isValidLocale(rule.locale)) {
      console.warn(`Locale ${rule.locale} not found in configuration`)
      continue
    }

    const rest = match[1]?.replace(/^\/+/, '') ?? ''
    const normalizedPath = rest ? `/${rule.locale}/${rest}` : `/${rule.locale}`

    const url = request.nextUrl.clone()
    url.pathname = normalizedPath
    url.search = search

    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all request paths except API routes, static files, and assets
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)',
  ],
}
