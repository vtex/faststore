import { useEffect } from 'react'

import { gql } from '@faststore/core/api'

import { useLazyQuery } from 'src/sdk/graphql/useLazyQuery'
import { getCookie } from 'src/utils/getCookie'

// Cookie set once the anonymous personalization session has been started,
// so we only fire `StartSession` a single time per browser session.
const VTEX_REC_USER_START_SESSION = 'vtex-rec-user-start-session'

const startSessionMutation = gql(`
  mutation StartSession {
    startSession
  }
`)

type StartSessionData = { startSession: boolean }
type StartSessionVariables = Record<string, never>

/**
 * Starts the anonymous recommendation/personalization session once per browser
 * session.
 *
 * Mounted globally from `Layout` so it runs on every page, regardless of
 * whether a recommendation section is present.
 *
 * The product view is no longer reported through a mutation here: the PDP now
 * exposes the product data as `<meta property="product:*">` tags, which the
 * Activity Flow script reads to capture the product view event.
 *
 * All work runs client-side in effects (after hydration), so it doesn't affect
 * SSR/TTFB or Lighthouse render metrics.
 */
export function useStartSession() {
  const [runStartSession] = useLazyQuery<
    StartSessionData,
    StartSessionVariables
  >(startSessionMutation, {} as StartSessionVariables, { doNotRun: true })

  useEffect(() => {
    const startSessionCookie = getCookie(VTEX_REC_USER_START_SESSION)

    if (startSessionCookie) {
      return
    }

    let cancelled = false

    // The session endpoint may not be ready on the first try, so we retry with
    // exponential backoff until it returns a defined result (or we give up).
    const retryUntilSuccess = async () => {
      const MAX_ATTEMPTS = 10
      let delay = 300

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        if (cancelled) {
          return
        }

        const result = await runStartSession({})

        if (result !== undefined) {
          return
        }

        await new Promise<void>((resolve) => setTimeout(resolve, delay))
        delay = Math.min(delay * 2, 3000)
      }
    }

    void retryUntilSuccess()

    return () => {
      cancelled = true
    }
  }, [runStartSession])
}
