import { useEffect, useState } from 'react'

import { getUserIdFromCookie } from 'src/sdk/analytics/utils'
import { retry } from 'src/utils/retry'

/**
 * Reads the anonymous recommendation user id from the cookie set by the
 * personalization pixel.
 *
 * The pixel may take a while to load and set the cookie, so the lookup is
 * retried until a value is available (or the budget runs out). The returned
 * value is tri-state:
 *
 * - `undefined`: still resolving (initial state);
 * - `null`: lookup finished without a usable id (e.g. the pixel never set it);
 * - `string`: the resolved user id.
 */
export function useRecommendationUserId(
  campaignVrn: string
): string | null | undefined {
  const [userId, setUserId] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    const controller = new AbortController()

    retry(() => getUserIdFromCookie(), { signal: controller.signal })
      .then((value) => {
        if (!controller.signal.aborted) {
          setUserId(value || null)
        }
      })
      .catch((retryError) => {
        console.error(
          'Error retrieving userId from cookie',
          retryError,
          campaignVrn
        )
        if (!controller.signal.aborted) {
          setUserId(null)
        }
      })

    return () => {
      controller.abort()
    }
  }, [campaignVrn])

  return userId
}
