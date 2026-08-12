import { useEffect, useRef } from 'react'

import { gql } from '@faststore/core/api'

import storeConfig from 'discovery.config'
import { useLazyQuery } from 'src/sdk/graphql/useLazyQuery'
import { getCookie } from 'src/utils/getCookie'
import { retry } from 'src/utils/retry'

// Cookie set once the anonymous personalization session has been started,
// so we only fire `StartRecommendationSession` a single time per browser session.
const VTEX_REC_USER_START_SESSION = 'vtex-rec-user-start-session'

const startRecommendationSessionMutation = gql(`
  mutation StartRecommendationSession {
    startRecommendationSession
  }
`)

type StartRecommendationSessionData = { startRecommendationSession: boolean }
type StartRecommendationSessionVariables = Record<string, never>

// In-memory lock so Layout re-renders / shelf fallback cannot start more than
// one session before the cookie lands. Survives effect cleanup / Strict Mode
// remounts for this JS realm.
let hasRequestedStartRecommendationSession = false

/** @internal Test-only: clears the in-memory session-start lock. */
export function resetStartRecommendationSessionLock() {
  hasRequestedStartRecommendationSession = false
}

/**
 * Starts the anonymous recommendation/personalization session once per browser
 * session.
 *
 * Mounted from `Layout` (gated by `experimental.enableRecommendations`) so it
 * runs on every page when the store opts in via discovery config. Also used as
 * a fallback from `RecommendationShelf` when the flag is off and `userId` is
 * missing — pass `enabled` to override the feature flag for that call site.
 *
 * Multiple callers still produce a single mutation: the in-memory lock plus the
 * session cookie ensure at most one attempt per browser session.
 *
 * The product view is no longer reported through a mutation here: the PDP now
 * exposes the product data as `<meta property="product:*">` tags, which the
 * Activity Flow script reads to capture the product view event.
 *
 * All work runs client-side in effects (after hydration), so it doesn't affect
 * SSR/TTFB or Lighthouse render metrics.
 *
 * @param enabled Optional override. When omitted, uses
 *   `storeConfig.experimental.enableRecommendations`. When provided (e.g. by
 *   RecommendationShelf fallback), that boolean wins.
 */
export function useStartRecommendationSession(enabled?: boolean) {
  const flagEnabled = storeConfig.experimental?.enableRecommendations === true
  const enableRecommendations = enabled ?? flagEnabled

  const [runStartRecommendationSession] = useLazyQuery<
    StartRecommendationSessionData,
    StartRecommendationSessionVariables
  >(
    startRecommendationSessionMutation,
    {} as StartRecommendationSessionVariables,
    {
      doNotRun: true,
    }
  )

  // useLazyQuery returns a new `execute` identity every render; keep a stable
  // ref so the effect does not re-subscribe (and re-fire) on unrelated updates.
  const runStartRecommendationSessionRef = useRef(runStartRecommendationSession)
  runStartRecommendationSessionRef.current = runStartRecommendationSession

  useEffect(() => {
    if (!enableRecommendations) {
      return
    }

    const startRecommendationSessionCookie = getCookie(
      VTEX_REC_USER_START_SESSION
    )
    if (startRecommendationSessionCookie) {
      return
    }

    if (hasRequestedStartRecommendationSession) {
      return
    }
    hasRequestedStartRecommendationSession = true

    // The session endpoint may not be ready on the first try, so we retry with
    // exponential backoff until it returns a defined result (or we give up).
    // Transient request/GraphQL rejections are treated as retryable: swallow
    // the error and return `undefined` so the backoff loop keeps going instead
    // of aborting on the first failure.
    //
    // Intentionally no AbortController: cleanup would cancel the only attempt
    // (Strict Mode remount / Layout re-render) while the lock stays set.
    void retry(
      async () => {
        try {
          return await runStartRecommendationSessionRef.current({})
        } catch {
          return undefined
        }
      },
      {
        attempts: 10,
        delayMs: 300,
        backoff: true,
        maxDelayMs: 3000,
        until: (result) => result !== undefined,
      }
      // Guard the discarded promise so a give-up (or any unexpected rejection)
      // never surfaces as an unhandled promise rejection.
    ).catch(() => {})
  }, [enableRecommendations])
}
