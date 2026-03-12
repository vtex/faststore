import storeConfig from 'discovery.config'
import { NextResponse, type NextRequest } from 'next/server'
import {
  getCustomPathsFromBindings,
  getSubdomainBindings,
  isValidLocale,
} from 'src/utils/localization/bindingPaths'

type RewriteRule = {
  regex: RegExp
  locale: string
  hostname?: string
}

function generateRewriteRules(): RewriteRule[] {
  if (!storeConfig.localization?.enabled) {
    return []
  }

  const customPaths = getCustomPathsFromBindings()

  const rules: RewriteRule[] = customPaths.map((customPath) => {
    const escapedPath = customPath.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`^${escapedPath}(?:\\/(.*))?$`, 'i')
    return {
      regex,
      locale: customPath.locale,
      hostname: customPath.hostname,
    }
  })

  return rules.sort((a, b) => {
    const aLength = a.regex.source.length
    const bLength = b.regex.source.length
    return bLength - aLength
  })
}

const DATA_ROUTE_RE = /^\/_next\/data\/[^/]+\/([^/]+)\/(.+)$/

const rewriteRules = generateRewriteRules()
const subdomainBindings = getSubdomainBindings()
const shouldValidateHostname = process.env.NODE_ENV === 'production'
const validLocales = new Set(
  Object.keys(storeConfig.localization?.locales || {})
)

/**
 * Rewrites the request to the subdomain locale.
 * Without this, getStaticProps receives the wrong locale on subdomain domains
 * because Next.js domain routing doesn't set the locale for server-side rendering.
 *
 * @param request - The request to rewrite.
 * @param locale - The locale to rewrite to.
 * @returns The rewritten response or null if the request is not a subdomain request.
 */
function rewriteSubdomainRequest(
  request: NextRequest,
  locale: string
): NextResponse | null {
  const { pathname, search } = request.nextUrl

  const dataMatch = pathname.match(DATA_ROUTE_RE)

  if (dataMatch) {
    const [, currentLocale] = dataMatch

    if (currentLocale !== locale && validLocales.has(currentLocale)) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.replace(`/${currentLocale}/`, `/${locale}/`)
      url.search = search

      return NextResponse.rewrite(url)
    }

    return null
  }

  const firstSegment = pathname.split('/')[1] ?? ''

  if (!validLocales.has(firstSegment)) {
    const rest = pathname.replace(/^\/+/, '')
    const normalizedPath = rest ? `/${locale}/${rest}` : `/${locale}`

    const url = request.nextUrl.clone()
    url.pathname = normalizedPath
    url.search = search

    return NextResponse.rewrite(url)
  }

  return null
}

export function proxy(request: NextRequest) {
  if (!storeConfig.localization?.enabled) {
    return NextResponse.next()
  }

  const { pathname, search, hostname } = request.nextUrl

  const subdomainMatch = subdomainBindings.find((b) => b.hostname === hostname)

  if (subdomainMatch && isValidLocale(subdomainMatch.locale)) {
    const result = rewriteSubdomainRequest(request, subdomainMatch.locale)

    if (result) {
      return result
    }
  }

  for (const rule of rewriteRules) {
    if (shouldValidateHostname && rule.hostname && rule.hostname !== hostname) {
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)',
    '/_next/data/:path*',
  ],
}
