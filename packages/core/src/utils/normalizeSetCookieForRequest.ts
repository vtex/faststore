import type { NextApiRequest } from 'next'

const ALLOWED_HOST_SUFFIXES = ['localhost', '.vtex.app', '.localhost']

// Example: "Set-Cookie: key=value; Domain=example.com; Path=/"
const MATCH_DOMAIN_REGEXP = /(?:^|;\s*)(?:domain=)([^;]+)/i

/**
 * Extracts hostname from the incoming request.
 */
export const getRequestHostname = ({
  request,
}: {
  request: NextApiRequest
}): string | null => {
  const hostHeader = request.headers.host?.trim()
  if (!hostHeader) {
    return null
  }

  try {
    return new URL(`https://${hostHeader}`).hostname
  } catch {
    return null
  }
}

/**
 * Checks whether the cookie domain should be replaced by host.
 */
const shouldReplaceCookieDomain = ({
  cookieDomain,
  host,
}: {
  cookieDomain: string
  host: string
}) => {
  const normalizedDomain = cookieDomain.replace(/^\./, '').toLowerCase()
  const normalizedHost = host.toLowerCase()

  return normalizedDomain !== normalizedHost
}

/**
 * Determines if host is eligible for domain normalization.
 */
const isAllowedHost = ({
  host,
  allowList,
}: {
  host: string
  allowList: string[]
}) => {
  const normalizedHost = host.toLowerCase()

  return allowList.some((suffix) => normalizedHost.endsWith(suffix))
}

/**
 * Ensure the cookie domain matches the current host so the browser can store it.
 */
export const normalizeSetCookieDomain = ({
  request,
  setCookie,
}: {
  request: NextApiRequest
  setCookie: string
}) => {
  const domainMatch = setCookie.match(MATCH_DOMAIN_REGEXP)
  if (!domainMatch) {
    return setCookie
  }

  const host = getRequestHostname({ request })
  if (!host) {
    return setCookie
  }
  const cookieDomain = domainMatch[1]

  if (
    !isAllowedHost({ host, allowList: ALLOWED_HOST_SUFFIXES }) ||
    !shouldReplaceCookieDomain({ cookieDomain, host })
  ) {
    return setCookie
  }

  return setCookie.replace(MATCH_DOMAIN_REGEXP, `; domain=${host}`)
}
