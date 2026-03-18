import type { RefObject } from 'react'
import { useEffect } from 'react'

/** Query param: presence enables webchat; only ?webchat=0 or ?webchat=false disables */
const WEBCHAT_QUERY_PARAM = 'webchat'

/** localStorage key: "1" = enabled, "0" = disabled. Persists across tabs and browser sessions. */
const WEBCHAT_STORAGE_KEY = 'webchatEnabled'
const WEBCHAT_SCRIPT_URL = 'https://cdn.cloud.weni.ai/agentic-cx.js'

/**
 * Injects or skips the webchat script based on URL and persisted preference (localStorage).
 * - Presence of ?webchat (any value except 0/false): enable, inject, and persist so webchat stays on across tabs and navigations.
 * - ?webchat=0 or ?webchat=false: disable and persist so it stays off until ?webchat is present again.
 * - No param: if localStorage says enabled, inject (webchat stays active in new tabs/windows too); otherwise do not inject.
 * @param containerRef - Optional ref to an HTMLElement. When provided, the script is appended inside this container (e.g. inside the Webchat section). Otherwise the script is appended to document.head.
 * Must be used in a component rendered in the body (not inside Next.js Head) so that useEffect runs on the client.
 */
export function useWebchatScript(
  containerRef?: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    if (process.env.DISABLE_3P_SCRIPTS) return
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const value = params.get(WEBCHAT_QUERY_PARAM)
    const hasParam = params.has(WEBCHAT_QUERY_PARAM)

    const explicitlyDisabled = hasParam && (value === '0' || value === 'false')
    if (explicitlyDisabled) {
      try {
        window.localStorage.setItem(WEBCHAT_STORAGE_KEY, '0')
      } catch {
        // ignore storage errors
      }
      return
    }

    let shouldInject = false
    if (hasParam) {
      shouldInject = true
      try {
        window.localStorage.setItem(WEBCHAT_STORAGE_KEY, '1')
      } catch {
        // ignore
      }
    } else {
      try {
        shouldInject = window.localStorage.getItem(WEBCHAT_STORAGE_KEY) === '1'
      } catch {
        // ignore
      }
      if (!shouldInject) return
    }

    const script = document.createElement('script')
    script.src = WEBCHAT_SCRIPT_URL
    const container = containerRef?.current
    if (container) {
      container.appendChild(script)
    } else {
      document.head.appendChild(script)
    }
  }, [])
}
