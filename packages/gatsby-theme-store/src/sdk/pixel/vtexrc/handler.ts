import { PixelEventHandler } from '../usePixelEvent'
import { PixelEvent } from '../pixel'

const getDataFromEvent = (event: PixelEvent) => {
  switch (event.type) {
    case 'vtex:homeView': {
      return {
        type: 'homeView',
        payload: undefined,
      }
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

export const handler: PixelEventHandler = (event) => {
  const data = getDataFromEvent(event)

  if (data) {
    window.vtexrca('sendevent', data.type, data.payload)
  }
}
