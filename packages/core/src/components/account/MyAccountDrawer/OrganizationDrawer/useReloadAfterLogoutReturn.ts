import { useEffect } from 'react'

/**
 * When the user logs out from the OrganizationDrawer, we redirect to VTEX ID logout
 * and then return to the store. If the browser restores the page from bfcache (or
 * the user lands with stale state), we need to reload so session-dependent data
 * (e.g. ProductShelf) is correct. This module ties that reload to the drawer flow.
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

/**
 * Hook to use in _app. Listens for return from logout (pageshow with bfcache)
 * and reloads when the drawer set the flag so data matches the new session.
 */
export const useReloadAfterLogoutReturn = (): void => {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return
      try {
        if (sessionStorage.getItem(RELOAD_AFTER_LOGOUT_KEY)) {
          sessionStorage.removeItem(RELOAD_AFTER_LOGOUT_KEY)
          window.location.reload()
        }
      } catch {
        // Ignore
      }
    }

    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])
}
