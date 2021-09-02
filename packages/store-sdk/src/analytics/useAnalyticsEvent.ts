import { useCallback, useEffect } from 'react'

import { ANALYTICS_EVENT_TYPE, unwrap } from './wrap'
import type { AnalyticsEvent } from './wrap'

export type AnalyticsEventHandler = (
  event: AnalyticsEvent
) => void | PromiseLike<void>

export const useAnalyticsEvent = (handler: AnalyticsEventHandler) => {
  const callback = useCallback(
    (message: MessageEvent) => {
      try {
        if (message.data.type !== ANALYTICS_EVENT_TYPE) {
          return
        }

        handler(unwrap(message.data))
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
