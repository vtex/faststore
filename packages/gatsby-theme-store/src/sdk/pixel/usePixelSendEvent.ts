import { useIdleEffect } from '../useIdleEffect'
import { wrap } from './pixel'
import type { PixelEvent } from './pixel'

type EventGenerator = () => PixelEvent | PixelEvent[]

export const sendPixelEvent = (event: PixelEvent) => {
  try {
    window.postMessage(wrap(event), window.origin)
  } catch (e) {
    // IE and Edge have a bug on postMessage inside promises.
    // Ignoring for now, will try to find a workaround that
    // makes postMessage work on those browsers.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/14719328/
    console.error(e)
  }
}

export const usePixelSendEvent = (
  event: PixelEvent | PixelEvent[] | EventGenerator,
  id = ''
) => {
  useIdleEffect(() => {
    const obj = typeof event === 'function' ? event() : event

    if (Array.isArray(obj)) {
      obj.forEach(sendPixelEvent)
    } else {
      sendPixelEvent(obj)
    }
  }, [id])
}
