import { parse } from 'cookie'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import discoveryConfig from 'discovery.config'
import {
  expireCookieServer,
  getCookieDomains,
  getVtexCookieNames,
} from 'src/utils/clearCookies'
import { VID_RT_PATHS } from 'src/sdk/account/refreshTokenPaths'
import { getCheckoutParentDomain } from 'src/utils/getCheckoutParentDomain'
import { getRequestHostname } from 'src/utils/getRequestHostname'

const ADDITIONAL_COOKIES = ['CheckoutOrderFormOwnership'] as const

/**
 * Clears all cookies containing 'vtex' in the name (case-insensitive) + ADDITIONAL_COOKIES
 * This endpoint handles HttpOnly cookies that cannot be cleared via JavaScript
 */
const handler: NextApiHandler = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  try {
    const hostname = getRequestHostname(request.headers.host)
    const cookies = parse(request.headers.cookie ?? '')
    const checkoutParent = hostname
      ? getCheckoutParentDomain(hostname)
      : undefined
    const domains = [
      ...(hostname ? getCookieDomains(hostname) : [undefined]),
      ...(checkoutParent ? [checkoutParent] : []),
    ]
    const clearedCookies: string[] = []

    const vtexCookieNames = getVtexCookieNames(Object.keys(cookies))

    // vid_rt is scoped to the refresh routes, so the browser never sends it
    // here and its presence can't be checked. Expire it on every path it can be scoped to.
    if (discoveryConfig.experimental?.refreshToken) {
      for (const path of VID_RT_PATHS) {
        for (const domain of domains) {
          clearedCookies.push(
            expireCookieServer({ name: 'vid_rt', path, domain })
          )
        }
      }
    }

    // Clear other cookies with path /
    const otherCookieNames = [
      ...vtexCookieNames,
      ...ADDITIONAL_COOKIES.filter((name) => cookies[name]),
    ]

    for (const cookieName of otherCookieNames) {
      for (const domain of domains) {
        const clearedCookie = expireCookieServer({
          name: cookieName,
          path: '/',
          domain,
        })
        clearedCookies.push(clearedCookie)
      }
    }

    if (clearedCookies.length > 0) {
      response.setHeader('set-cookie', clearedCookies)
    }

    response.status(200).json({ success: true })
  } catch (error) {
    console.error('Error clearing cookies:', error)
    response
      .status(500)
      .json({ success: false, error: 'Failed to clear cookies' })
  }
}

export default handler
