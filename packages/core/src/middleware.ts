import { NextResponse, type NextRequest } from 'next/server'
import storeConfig from 'discovery.config'
import type { LocalesSettings } from 'src/typings/locales'
import { getCustomPathsFromBindings } from 'src/utils/localization/customPaths'

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

function generateRewriteRules(): RewriteRule[] {
  const rules: RewriteRule[] = []

  if (!storeConfig.localization?.enabled) {
    return rules
  }

  const customPaths = getCustomPathsFromBindings()
  const locales = (storeConfig.localization.locales ||
    {}) as LocalesSettings['locales']

  for (const customPath of customPaths) {
    const localeConfig = locales[customPath.locale]

    if (!localeConfig?.bindings || !Array.isArray(localeConfig.bindings)) {
      continue
    }

    for (const binding of localeConfig.bindings) {
      if (!binding.url) {
        continue
      }

      try {
        const bindingUrl = new URL(binding.url)
        const pathname = bindingUrl.pathname.replace(/\/$/, '')

        if (pathname !== customPath.path) {
          continue
        }

        const escapedPath = customPath.path.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        )

        const regex = new RegExp(`^${escapedPath}(?:\\/(.*))?$`, 'i')

        rules.push({
          regex,
          locale: customPath.locale,
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
    // TODO: Re-enable hostname validation after testing
    // if (rule.hostname && rule.hostname !== hostname) {
    //   continue
    // }

    // TODO: re-enable validation of locale in subdomain bindings
    // useLocaleValidation()

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
