import { useEffect } from 'react'

/** Query param: presence enables webchat; only ?webchat=0 or ?webchat=false disables */
const WEBCHAT_QUERY_PARAM = 'webchat'

/** localStorage key: "1" = enabled, "0" = disabled. Persists across tabs and browser sessions. */
const WEBCHAT_STORAGE_KEY = 'webchatEnabled'

const WEBCHAT_SCRIPT_CONTENT =
  '(function (d, s, u, w, v) {' +
  'if (w[v]) { return; } else { w[v] = !0; }' +
  'let h = d.getElementsByTagName(s)[0], k = d.createElement(s);' +
  'k.onload = function () {' +
  'let l = d.createElement(s); l.src = u; l.async = true;' +
  'h.parentNode.insertBefore(l, k.nextSibling);' +
  '};' +
  "k.async = true; k.src = 'https://weni-media-sp.s3.sa-east-1.amazonaws.com/conversation-starters-demo/webchat.umd.js';" +
  'h.parentNode.insertBefore(k, h);' +
  "})(document, 'script', 'https://weni-media-sp.s3.sa-east-1.amazonaws.com/conversation-starters-demo/script.js', window, 'isWeniWebChatAlreadyInserted');"

/**
 * Injects or skips the webchat script based on URL and persisted preference (localStorage).
 * - Presence of ?webchat (any value except 0/false): enable, inject, and persist so webchat stays on across tabs and navigations.
 * - ?webchat=0 or ?webchat=false: disable and persist so it stays off until ?webchat is present again.
 * - No param: if localStorage says enabled, inject (webchat stays active in new tabs/windows too); otherwise do not inject.
 * Must be used in a component rendered in the body (not inside Next.js Head) so that useEffect runs on the client.
 */
export function useWebchatScript(): void {
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
    script.textContent = WEBCHAT_SCRIPT_CONTENT
    document.head.appendChild(script)
  }, [])
}
