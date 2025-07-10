import { useCallback, useEffect } from 'react'

import { ANALYTICS_EVENT_TYPE, unwrap } from './wrap'
import type { UnknownEvent } from './wrap'

export const useAnalyticsEvent = <T extends UnknownEvent = UnknownEvent>(
  handler: (event: T) => unknown
) => {
  const callback = useCallback(
    (message: MessageEvent) => {
      try {
        if ((message.data as UnknownEvent).name !== ANALYTICS_EVENT_TYPE) {
          return
        }

        handler(unwrap(message.data))
      } catch (err) {
        console.error('Something went wrong while running Analytics handler')
      }
    },
    [handler]
  )

  useEffect(() => {
    window.addEventListener('message', callback)

    return () => window.removeEventListener('message', callback)
  }, [callback])
}
