/*
 * This middleware is disabled by default. Only stores that are in
 * homebrew and want this functionality will be able to enable it via
 * a feature flag. When the flag is active, the CLI at build time will
 * check whether the ENABLE_REDIRECTS_MIDDLEWARE flag is set or not,
 * if so, the file name will be changed to middleware.ts and nextjs
 * will know how to automatically deal with it.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import storeConfig from 'discovery.config'

import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'

const dynamoDbClient = new DynamoDBClient({})

const TABLE_NAME = 'faststore-redirects'
const ACCOUNT_ID = storeConfig.api.storeId

class DynamoRedirectsClient {
  async get(from: string) {
    try {
      const command = new GetItemCommand({
        TableName: TABLE_NAME,
        Key: {
          account_name: {
            S: ACCOUNT_ID,
          },
          from: {
            S: from,
          },
        },
      })

      const { Item } = await dynamoDbClient.send(command)

      if (!Item) {
        return null
      }

      const redirect = {
        to: Item.to.S,
        from: Item.from.S,
        type: Item.type.S,
      }

      return redirect
    } catch (error) {
      console.error(error)
      return null
    }
  }
}

const redirectsClient = new DynamoRedirectsClient()

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const redirect = await redirectsClient.get(pathname)

  if (redirect) {
    const redirectUrl = new URL(redirect.to, storeConfig.storeUrl)
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
