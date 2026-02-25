import { useEffect } from 'react'

/**
 * When the user logs out from the OrganizationDrawer, we redirect to VTEX ID logout
 * and then return to the store. We need to reload so session-dependent data
 * (e.g. ProductShelf) and caches are fresh. This module ties that reload to the drawer flow.
 *
 * The return can happen in two ways:
 * 1) bfcache restore: user hits Back or browser restores from cache → pageshow with persisted=true
 * 2) Fresh load: VTEX ID redirects back → new navigation, persisted=false
 *
 * We handle both: check the flag on mount (fresh load) and on pageshow (bfcache).
 */

export const RELOAD_AFTER_LOGOUT_KEY = 'faststore_reload_after_logout_return'

/**
 * Call before redirecting to logout. When the user returns to the store, the app
 * will reload once so session state and caches are fresh.
 */
export const setReloadAfterLogoutReturn = (): void => {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(RELOAD_AFTER_LOGOUT_KEY, '1')
  } catch {
    // Ignore
  }
}

const checkAndReloadIfReturnedFromLogout = (): void => {
  try {
    if (sessionStorage.getItem(RELOAD_AFTER_LOGOUT_KEY)) {
      sessionStorage.removeItem(RELOAD_AFTER_LOGOUT_KEY)
      window.location.reload()
    }
  } catch {
    // Ignore
  }
}

/**
 * Hook to use in _app. Ensures a full reload when the user returns from logout
 * (either via bfcache or fresh redirect), so data matches the new session.
 */
export const useReloadAfterLogoutReturn = (): void => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1) On mount: handles fresh load return (VTEX ID redirect). pageshow with persisted=false
    //    means we never get the event for that case, so we must check here.
    checkAndReloadIfReturnedFromLogout()

    // 2) On pageshow with persisted: handles bfcache restore
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkAndReloadIfReturnedFromLogout()
      }
    }

    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])
}
