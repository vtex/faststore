import { useCallback, useEffect } from 'react'

import { unwrap } from './pixel'
import type { PixelEvent } from './pixel'

export type PixelEventHandler = (event: PixelEvent) => void | Promise<void>

export const usePixelEvent = (handler: PixelEventHandler) => {
  const callback = useCallback(
    (message: MessageEvent) => {
      try {
        const maybeEvent = unwrap(message.data ?? {})

        if (maybeEvent) {
          handler(maybeEvent)
        }
      } catch (err) {
        console.error('Some bad happened while running Pixel handler')
      }
    },
    [handler]
  )

  useEffect(() => {
    window.addEventListener('message', callback)

    return () => window.removeEventListener('message', callback)
  }, [callback])
}
