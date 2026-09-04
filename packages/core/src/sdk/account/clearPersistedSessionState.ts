import { SESSION_READY_KEY } from '../session/storageKeys'
import {
  STORAGE_KEY_CACHE_BUST_LAST_VALUE,
  STORAGE_KEY_PERSON_ID,
} from 'src/utils/cookieCacheBusting'
import {
  expireCookieClient,
  getCookieDomains,
  getCookiePaths,
} from 'src/utils/clearCookies'

/** Cookie holding the checkout orderForm id that `validateCart` reuses. */
export const CHECKOUT_ORDER_FORM_COOKIE = 'checkout.vtex.com'
/** Persisted `@faststore/sdk` stores that belong to the previous commercial context. */
export const PERSISTED_STORE_KEYS = ['fs::session', 'fs::cart'] as const

/**
 * Expires `checkout.vtex.com` for every domain/path variant so the next
 * `validateCart` creates a fresh orderForm under the new contract instead of
 * reusing the previous contract's (whose clientProfileData no longer matches
 * the auth cookie — B2BTEAM-3827).
 */
export function expireCheckoutOrderFormCookie(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  const { hostname, pathname, protocol } = window.location
  const secure = protocol === 'https:'
  for (const domain of getCookieDomains(hostname)) {
    for (const path of getCookiePaths(pathname)) {
      expireCookieClient({
        name: CHECKOUT_ORDER_FORM_COOKIE,
        path,
        domain,
        secure,
      })
    }
  }
}

/**
 * Clears client-side persistence of the previous commercial context (session,
 * cart, checkout orderForm cookie) so a hard reload rehydrates from
 * validateSession / validateCart under the new contract.
 */
export async function clearPersistedSessionState(): Promise<void> {
  try {
    const { del } = await import('idb-keyval')
    await Promise.all(
      PERSISTED_STORE_KEYS.map((key) => del(key).catch(() => {}))
    )
  } catch {}

  try {
    expireCheckoutOrderFormCookie()
  } catch {
    /* best-effort: cookie expiry must never fail the switch */
  }

  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.removeItem(SESSION_READY_KEY)
    sessionStorage.removeItem(STORAGE_KEY_PERSON_ID)
    sessionStorage.removeItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)
  } catch {}
}
