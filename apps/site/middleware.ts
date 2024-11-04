import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)
  if (pathname.startsWith('/docs')) {
    return NextResponse.redirect(
      `https://developers.vtex.com/docs/guides/faststore${pathname.replace(
        '/docs',
        ''
      )}`
    )
  }
  if (pathname.startsWith('/components')) {
    return NextResponse.redirect(
      `https://developers.vtex.com/docs/guides/faststore${pathname
        .replace('/components', '')
        .replace(/\/([^\/]*)\//, '/$1-')}`
    )
  }
  return NextResponse.next()
}
