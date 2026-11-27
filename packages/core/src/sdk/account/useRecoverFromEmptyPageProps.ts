import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const ACCOUNT_ROUTE_PREFIX = '/pvt/account'
export const RECOVERY_STORAGE_KEY = 'fs:account-empty-props-reload'
export const RECOVERY_GUARD_WINDOW_MS = 30_000

export const EMPTY_PAGE_PROPS_RELOAD_MESSAGE =
  '[faststore:empty-page-props] Empty page props on a My Account route, reloading the page once to recover.'
export const EMPTY_PAGE_PROPS_SKIPPED_MESSAGE =
  '[faststore:empty-page-props] Empty page props on a My Account route, reload skipped.'

const isEmptyPageProps = (pageProps: unknown) =>
  pageProps == null ||
  typeof pageProps !== 'object' ||
  Object.keys(pageProps).length === 0

const isAccountRoute = (pathname: string | undefined) =>
  pathname === ACCOUNT_ROUTE_PREFIX ||
  Boolean(pathname?.startsWith(`${ACCOUNT_ROUTE_PREFIX}/`))

/**
 * Registers the reload attempt for the current path. Returns `false` when a
 * reload for the same path already happened inside the guard window, or when
 * `sessionStorage` is unavailable (without it a reload loop could not be
 * prevented).
 */
const claimReload = (path: string) => {
  try {
    const now = Date.now()
    const raw = globalThis.sessionStorage.getItem(RECOVERY_STORAGE_KEY)
    const last = raw ? JSON.parse(raw) : null

    if (
      last?.path === path &&
      typeof last.timestamp === 'number' &&
      now - last.timestamp < RECOVERY_GUARD_WINDOW_MS
    ) {
      return false
    }

    globalThis.sessionStorage.setItem(
      RECOVERY_STORAGE_KEY,
      JSON.stringify({ path, timestamp: now })
    )

    return true
  } catch {
    return false
  }
}

/**
 * A CDN can cache the `{}` response of a middleware-skipped Next.js prefetch
 * and serve it to the real `/_next/data` navigation, so a My Account page
 * mounts with empty page props. A reload requests the HTML document, which
 * runs `getServerSideProps` and bypasses that poisoned data cache.
 *
 * The reload happens at most once per path inside a short window, and only
 * on the client after hydration.
 */
export function useRecoverFromEmptyPageProps(pageProps: unknown) {
  const router = useRouter()
  const isEmpty = isEmptyPageProps(pageProps)
  const isAccountPage = isAccountRoute(router.pathname)
  const isFallback = Boolean(router.isFallback)

  useEffect(() => {
    if (!isEmpty || !isAccountPage || isFallback) {
      return
    }

    if (claimReload(globalThis.location.pathname)) {
      console.warn(EMPTY_PAGE_PROPS_RELOAD_MESSAGE)
      globalThis.location.reload()
    } else {
      console.warn(EMPTY_PAGE_PROPS_SKIPPED_MESSAGE)
    }
  }, [isEmpty, isAccountPage, isFallback])
}
