import { NextResponse, type NextRequest } from 'next/server'

type RewriteRule = {
  regex: RegExp
  locale: string
}

const rewriteRules: RewriteRule[] = [
  { regex: /^\/pt\/br(?:\/(.*))?$/i, locale: 'pt-BR' },
  { regex: /^\/en\/us(?:\/(.*))?$/i, locale: 'en-US' },
  { regex: /^\/america\/pt(?:\/(.*))?$/i, locale: 'pt-BR' },
  { regex: /^\/america\/en(?:\/(.*))?$/i, locale: 'en-US' },
]

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  for (const rule of rewriteRules) {
    const match = pathname.match(rule.regex)
    if (!match) continue

    const rest = match[1]?.replace(/^\/+/, '') ?? ''
    const normalizedPath = rest ? `/${rule.locale}/${rest}` : `/${rule.locale}`

    const url = request.nextUrl.clone()
    url.pathname = normalizedPath
    url.search = search
    url.locale = rule.locale

    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/|api/|.*\\.[^/]+$).*)'],
}
