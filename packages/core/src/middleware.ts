import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RedirectsClient } from 'src/sdk/redirects'
import storeConfig from 'discovery.config.default'

const redirectsClient = new RedirectsClient()

//cache-control: max-age=300, stale-while-revalidate=31536000
//faststore-redirects-time: 10
export async function middleware(request: NextRequest) {
  const startTime = Date.now()
  const { pathname } = request.nextUrl

  const redirect = await redirectsClient.get(pathname)

  if (redirect) {
    const pathnameToRedirect = redirect.to
    const redirectUrl = storeConfig.storeUrl + pathnameToRedirect

    const redirectStatusCode = redirect.type === 'permanent' ? 301 : 302
    const response = NextResponse.redirect(redirectUrl, redirectStatusCode)

    response.headers.set(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=31536000'
    )

    const endTime = Date.now()
    const executionTime = endTime - startTime

    response.headers.set('faststore-redirects-time', executionTime.toString())

    return response
  }

  const endTime = Date.now()
  const executionTime = endTime - startTime

  const response = NextResponse.next()

  response.headers.set('faststore-redirects-time', executionTime.toString())
  return response
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
