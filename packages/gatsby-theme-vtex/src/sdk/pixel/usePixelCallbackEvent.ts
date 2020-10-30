import { useCallback, useEffect } from 'react'

import { PixelEvent, unwrap } from './pixel'

export type PixelEventHandler = (event: PixelEvent) => void | Promise<void>

export const usePixelCallbackEvent = (handler: PixelEventHandler) => {
  const callback = useCallback(
    (message: any) => {
      try {
        const maybeEvent = unwrap(message)

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
