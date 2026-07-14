import { useEffect } from 'react'

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
 *
 * Gated behind the `experimental.enableRecommendations` flag: stores that don't
 * opt into Recommendations never start a session nor hit the Recommendations API.
 */
export function useStartRecommendationSession() {
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

  useEffect(() => {
    if (!storeConfig.experimental.enableRecommendations) {
      return
    }

    const startRecommendationSessionCookie = getCookie(
      VTEX_REC_USER_START_SESSION
    )

    if (startRecommendationSessionCookie) {
      return
    }

    const controller = new AbortController()

    // The session endpoint may not be ready on the first try, so we retry with
    // exponential backoff until it returns a defined result (or we give up).
    // Transient request/GraphQL rejections are treated as retryable: swallow
    // the error and return `undefined` so the backoff loop keeps going instead
    // of aborting on the first failure.
    void retry(
      async () => {
        try {
          return await runStartRecommendationSession({})
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
        signal: controller.signal,
      }
      // Guard the discarded promise so a give-up (or any unexpected rejection)
      // never surfaces as an unhandled promise rejection.
    ).catch(() => {})

    return () => {
      controller.abort()
    }
  }, [runStartRecommendationSession])
}
