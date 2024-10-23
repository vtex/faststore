import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RedirectsClient } from 'src/sdk/redirects'
import storeConfig from 'discovery.config.default'

const redirectsClient = new RedirectsClient()

//cache-control: max-age=300, stale-while-revalidate=31536000

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const redirect = await redirectsClient.get(pathname)
  console.log('redirect response: ', redirect)
  if (redirect) {
    const pathnameToRedirect = redirect.to
    const redirectUrl = storeConfig.storeUrl + pathnameToRedirect

    const redirectStatusCode = redirect.type === 'permanent' ? 301 : 302
    const response = NextResponse.redirect(redirectUrl, redirectStatusCode)

    response.headers.set(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=31536000'
    )

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
