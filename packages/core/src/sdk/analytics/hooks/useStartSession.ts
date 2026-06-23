import { useEffect, useRef } from 'react'

import { gql } from '@faststore/core/api'

import {
  checkIsMobile,
  getUserIdFromCookie,
} from 'src/components/RecommendationShelf/utils'
import { useLazyQuery } from 'src/components/RecommendationShelf/queries/useLazyQuery'
import { getCookie } from 'src/utils/getCookie'

// Cookie set once the anonymous personalization session has been started,
// so we only fire `StartSession` a single time per browser session.
const VTEX_REC_USER_START_SESSION = 'vtex-rec-user-start-session'

const startSessionMutation = gql(`
  mutation StartSession {
    startSession
  }
`)

const sendProductViewEventMutation = gql(`
  mutation SendProductViewEvent(
    $userId: String!
    $product: String!
    $source: ProductViewSource
  ) {
    sendProductViewEvent(userId: $userId, product: $product, source: $source)
  }
`)

type ProductViewSource = 'WEB_DESKTOP' | 'WEB_MOBILE'

type StartSessionData = { startSession: boolean }
type StartSessionVariables = Record<string, never>

type SendProductViewEventData = { sendProductViewEvent: boolean }
type SendProductViewEventVariables = {
  userId: string
  product: string
  source: ProductViewSource
}

/**
 * Global recommendation/personalization tracking side effects:
 * - starts an anonymous session once per browser session;
 * - reports a product view whenever a new PDP product is displayed.
 *
 * Mounted globally from `Layout` so it runs on every page, regardless of
 * whether a recommendation section is present.
 *
 * `Layout` sits above every `PageProvider`, so we can't read the PDP context
 * via `usePDP()` here. Instead the current page's props are forwarded from
 * `Layout` (same pattern as `usePageViewEvent`); on a PDP they contain the
 * product, elsewhere they don't.
 *
 * All work runs client-side in effects (after hydration), so it doesn't affect
 * SSR/TTFB or Lighthouse render metrics.
 */
export function useStartSession(props?: any) {
  const productId: string | null =
    props?.data?.product?.isVariantOf?.productGroupID ?? null
  const lastProductViewSentRef = useRef<string | null>(null)

  const [runStartSession] = useLazyQuery<
    StartSessionData,
    StartSessionVariables
  >(startSessionMutation, {} as StartSessionVariables, { doNotRun: true })

  const [runSendProductViewEvent] = useLazyQuery<
    SendProductViewEventData,
    SendProductViewEventVariables
  >(sendProductViewEventMutation, {} as SendProductViewEventVariables, {
    doNotRun: true,
  })

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

  useEffect(() => {
    if (!productId) {
      lastProductViewSentRef.current = null
      return
    }

    const userId = getUserIdFromCookie()
    if (!userId) {
      return
    }

    // Avoid re-sending the same product view on unrelated re-renders.
    if (lastProductViewSentRef.current === productId) {
      return
    }

    lastProductViewSentRef.current = productId

    const source: ProductViewSource = checkIsMobile()
      ? 'WEB_MOBILE'
      : 'WEB_DESKTOP'

    void runSendProductViewEvent({ userId, product: productId, source })
  }, [productId, runSendProductViewEvent])
}
