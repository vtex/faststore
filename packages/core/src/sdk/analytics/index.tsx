import type { AnalyticsEvent } from '@vtex/faststore-sdk'
import { useAnalyticsEvent, type UnknownEvent } from '@vtex/faststore-sdk'

import storeConfig from '../../../discovery.config'

if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer ?? []
  window.VTEX_METADATA = {
    account: storeConfig.api.storeId,
    renderer: 'faststore',
  }
}

const AnalyticsHandler = (): null => {
  useAnalyticsEvent((event: UnknownEvent) => {
    // Cleans the ecommerce object before pushing a new one
    // This prevents the new data from getting merged with the previous one
    // which could lead do inaccurate and old data being sent with events

    // source: https://developers.google.com/tag-manager/ecommerce-ga4?hl=pt-br#clearing_the_ecommerce_object

    window.dataLayer.push({ ecommerce: null })

    const payload = event.isEcommerceEvent
      ? ({ event: event.name, ecommerce: event.params } as {
          event: AnalyticsEvent['name']
          ecommerce: AnalyticsEvent['params']
        })
      : { event: event.name, ...event.params }

    window.dataLayer.push(payload)

    import(`./platform/${storeConfig.platform}`).then(
      ({ default: sendEvent }) => {
        sendEvent(event)
      }
    )
  })

  return null
}

export default AnalyticsHandler
