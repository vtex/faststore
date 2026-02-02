import { NextResponse, type NextRequest } from 'next/server'
import storeConfig from 'discovery.config'
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

const rewriteRules = generateRewriteRules()
const shouldValidateHostname = process.env.NODE_ENV === 'production'

export function middleware(request: NextRequest) {
  if (!storeConfig.localization?.enabled) {
    return NextResponse.next()
  }

  const { pathname, search, hostname } = request.nextUrl

  for (const rule of rewriteRules) {
    if (shouldValidateHostname && rule.hostname && rule.hostname !== hostname) {
      continue
    }

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
