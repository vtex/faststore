/**
 * More info at: https://www.notion.so/vtexhandbook/Event-API-Documentation-48eee26730cf4d7f80f8fd7262231f84
 */
import type { AnalyticsEvent } from '@faststore/sdk'
import type {
  IntelligentSearchQueryEvent,
  SearchSelectItemEvent,
} from '../../types'

import config from '../../../../../faststore.config'
import { getCookie } from '../../../../utils/getCookie'

const THIRTY_MINUTES_S = 30 * 60
const ONE_YEAR_S = 365 * 24 * 3600

const randomUUID = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : (Math.random() * 1e6).toFixed(0)

const createCookie = (key: string, expiresSecond: number) => {
  // Setting the domain attribute specifies which host can receive it; we need it to make the cookies available on the `secure` subdomain.
  // Although https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie mentioned leading dot (.) is not needed and ignored. I couldn't set the cookies without it.
  const urlDomain = `.${new URL(config.storeUrl).hostname}`

  return () => {
    const isExpired = getCookie(key) === undefined

    if (isExpired) {
      const value = randomUUID()

      document.cookie = `${key}=${value}; max-age=${expiresSecond}; domain=${urlDomain}; path=/;`
      // Setting the `path=/` makes the cookie accessible on any path of the domain/subdomain

      return value
    }

    return getCookie(key)
  }
}

const user = {
  anonymous: createCookie('vtex-faststore-anonymous', ONE_YEAR_S),
  session: createCookie('vtex-faststore-session', THIRTY_MINUTES_S),
}

type SearchEvent =
  | {
      type: 'session.ping'
    }
  | {
      position: number
      productId: string
      text: string
      url: string
      type: 'search.click'
    }
  | {
      text: string
      misspelled: boolean
      match: number
      operator: string
      locale: string
      url: string
      type: 'search.query'
    }

const sendEvent = (options: SearchEvent & { url?: string }) =>
  fetch(`https://sp.vtex.com/event-api/v1/${config.api.storeId}/event`, {
    method: 'POST',
    body: JSON.stringify({
      ...options,
      userAgent: navigator.userAgent,
      anonymous: user.anonymous(),
      session: user.session(),
    }),
    headers: {
      'content-type': 'application/json',
    },
  })

const isFullTextSearch = (url: URL) =>
  typeof url.searchParams.get('q') === 'string' &&
  /^\/s(\/)?$/g.test(url.pathname)

const handleEvent = (
  event: AnalyticsEvent | SearchSelectItemEvent | IntelligentSearchQueryEvent
) => {
  switch (event.name) {
    case 'search_select_item': {
      const url = new URL(event.params.url)

      if (!isFullTextSearch(url)) {
        return
      }

      for (const item of event.params.items ?? []) {
        const productId = item.item_id ?? item.item_variant
        const position = item.index

        if (productId && position) {
          sendEvent({
            type: 'search.click',
            productId,
            position,
            url: url.href,
            text: url.searchParams.get('q') ?? '<empty>',
          })
        }
      }

      break
    }

    case 'intelligent_search_query': {
      sendEvent({
        type: 'search.query',
        url: event.params.url,
        text: event.params.term,
        misspelled: event.params.isTermMisspelled,
        match: event.params.totalCount,
        operator: event.params.logicalOperator,
        locale: event.params.locale,
      })

      break
    }

    default:
  }
}

setInterval(
  () => sendEvent({ type: 'session.ping' }),
  60 * 1e3 /* One minute */
)

export default handleEvent
