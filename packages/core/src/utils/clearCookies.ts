type ExpireCookieClientParams = {
  name: string
  path: string
  domain?: string
  secure?: boolean
}

type ExpireCookieServerParams = {
  name: string
  path: string
  domain?: string
}

/**
 * Client-side: Expires a cookie by setting it to expire in the past
 */
export const expireCookieClient = ({
  name,
  path,
  domain,
  secure = false,
}: ExpireCookieClientParams): void => {
  const domainAttr = domain ? `; domain=${domain}` : ''
  const secureAttr = secure ? '; secure' : ''
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=${path}${domainAttr}; samesite=lax${secureAttr}`
}

/**
 * Server-side: Generates a Set-Cookie header string to expire a cookie
 */
export const expireCookieServer = ({
  name,
  path,
  domain,
}: ExpireCookieServerParams): string => {
  const domainAttr = domain ? `; domain=${domain}` : ''
  return `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=${path}${domainAttr}; samesite=lax; httponly`
}

/**
 * Utility functions for clearing cookies
 * Shared logic between client-side and server-side cookie clearing
 */

/**
 * Generates domain variations for cookie clearing
 * Tries multiple domain combinations to ensure cookies are cleared regardless of how they were set
 */
export const getCookieDomains = (
  hostname: string
): Array<string | undefined> => [
  undefined, // host-only cookie
  hostname,
  hostname.startsWith('.') ? hostname : `.${hostname}`,
]

/**
 * Filters cookie names that contain 'vtex' (case-insensitive)
 */
export const getVtexCookieNames = (cookieNames: string[]): string[] => {
  return cookieNames.filter((name) => name.toLowerCase().includes('vtex'))
}

/**
 * Generates paths to try when clearing cookies
 * Includes root path and all parent paths from current pathname
 */
export const getCookiePaths = (pathname: string): string[] => {
  const paths: string[] = ['/']
  const pathParts = pathname.split('/').filter(Boolean)

  let current = ''
  for (const part of pathParts) {
    current += `/${part}`
    if (!paths.includes(current)) paths.push(current)
  }

  return paths
}
