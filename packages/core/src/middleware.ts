import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RedirectsClient } from 'src/sdk/redirects'
import storeConfig from 'discovery.config.default'

const redirectsClient = new RedirectsClient()

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const redirect = await redirectsClient.get(pathname)
  console.log({ pathname })

  if (redirect) {
    console.log('redirect matched', redirect)
    const pathnameToRedirect = redirect.to
    const redirectUrl = storeConfig.storeUrl + pathnameToRedirect

    // const url = req.nextUrl.clone()
    // url.pathname = redirect.to
    // url.host = storeConfig.storeUrl
    // console.log(url)

    console.log(redirectUrl)

    const redirectStatusCode = redirect.type === 'permanent' ? 308 : 307
    return NextResponse.redirect(redirectUrl, redirectStatusCode)
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
