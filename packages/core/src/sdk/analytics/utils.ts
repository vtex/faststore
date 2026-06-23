import { getCookie } from 'src/utils/getCookie'

const MAX_MOBILE_WIDTH = 768

// Name of the cookie that holds the anonymous user id used by the
// recommendation/personalization pixel.
const USER_ID_COOKIE = 'vtex-rec-user-id'

export function checkIsMobile(): boolean {
  if (globalThis.window === undefined) {
    return false
  }

  return globalThis.window.innerWidth <= MAX_MOBILE_WIDTH
}

export function getUserIdFromCookie(): string {
  return getCookie(USER_ID_COOKIE) ?? ''
}
