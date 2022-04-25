import type { AnalyticsEvent } from '@faststore/sdk'
import { useAnalyticsEvent } from '@faststore/sdk'

import storeConfig from '../../../store.config'

if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer ?? []
}

export const AnalyticsHandler = () => {
  useAnalyticsEvent((event: AnalyticsEvent) => {
    // Cleans the ecommerce object before pushing a new one
    // This prevents the new data from getting merged with the previous one
    // which could lead do inaccurate and old data being sent with events
    //
    // source: https://developers.google.com/tag-manager/ecommerce-ga4?hl=pt-br#clearing_the_ecommerce_object
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push({ event: event.name, ecommerce: event.params })

    import(`./platform/${storeConfig.platform}`).then(
      ({ default: sendEvent }) => {
        sendEvent(event)
      }
    )
  })

  return null
}

export default AnalyticsHandler
