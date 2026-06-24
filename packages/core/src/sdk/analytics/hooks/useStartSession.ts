import { useEffect } from 'react'

import { gql } from '@faststore/core/api'

import { useLazyQuery } from 'src/sdk/graphql/useLazyQuery'
import { getCookie } from 'src/utils/getCookie'
import { retry } from 'src/utils/retry'

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

    const controller = new AbortController()

    // The session endpoint may not be ready on the first try, so we retry with
    // exponential backoff until it returns a defined result (or we give up).
    void retry(() => runStartSession({}), {
      attempts: 10,
      delayMs: 300,
      backoff: true,
      maxDelayMs: 3000,
      until: (result) => result !== undefined,
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [runStartSession])
}
