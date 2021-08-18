import { useCallback, useEffect } from 'react'

import { unwrap } from '.'
import type { AnalyticsEvent } from '.'

export type AnalyticsEventHandler = (
  event: AnalyticsEvent
) => void | PromiseLike<void>

export const useAnalyticsEvent = (handler: AnalyticsEventHandler) => {
  const callback = useCallback(
    (message: MessageEvent) => {
      try {
        const maybeEvent = unwrap(message.data ?? {})

        if (maybeEvent) {
          handler(maybeEvent)
        }
      } catch (err) {
        console.error('Some bad happened while running Analytics handler')
      }
    },
    [handler]
  )

  useEffect(() => {
    window.addEventListener('message', callback)

    return () => window.removeEventListener('message', callback)
  }, [callback])
}
