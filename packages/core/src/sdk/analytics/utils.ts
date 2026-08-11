import { getCookie } from 'src/utils/getCookie'

// Name of the cookie that holds the anonymous user id used by the
// recommendation/personalization pixel.
const USER_ID_COOKIE = 'vtex-rec-user-id'

export function getUserIdFromCookie(): string {
  return getCookie(USER_ID_COOKIE) ?? ''
}
