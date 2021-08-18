import type { AnalyticsEventHandler, AnalyticsEvent } from '@vtex/store-sdk'

const getDataFromEvent = (event: AnalyticsEvent) => {
  switch (event.type) {
    case 'vtex:pageView': {
      if (event.data.pageType === 'home') {
        return {
          type: 'homeView',
          payload: undefined,
        }
      }

      return
    }

    case 'vtex:productView': {
      return {
        type: 'productView',
        payload: event.data.product,
      }
    }

    case 'vtex:internalSiteSearchView': {
      return {
        type: 'internalSiteSearchView',
        payload: {
          siteSearchTerm: event.data.term,
          siteSearchResults: event.data.results,
        },
      }
    }

    default:
  }
}

export const handler: AnalyticsEventHandler = (event) => {
  const data = getDataFromEvent(event)

  if (data) {
    window.vtexrca('sendevent', data.type, data.payload)
  }
}
