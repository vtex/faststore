/**
 * More info at: https://developers.vtex.com/docs/api-reference/intelligent-search-events-api-headless
 */
import type { AnalyticsEvent } from '@faststore/sdk'
import type {
  IntelligentSearchAutocompleteQueryEvent,
  IntelligentSearchQueryEvent,
  SearchSelectItemEvent,
} from '../../types'

import config from '../../../../../discovery.config'
import { getCookie } from '../../../../utils/getCookie'

const THIRTY_MINUTES_S = 30 * 60
const ONE_YEAR_S = 365 * 24 * 3600

const randomUUID = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().replaceAll('-', '')
    : (Math.random() * 1e6).toFixed(0)

const createOrRefreshCookie = (key: string, expiresSecond: number) => {
  // Setting the domain attribute specifies which host can receive it; we need it to make the cookies available on the `secure` subdomain.
  // Although https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie mentioned leading dot (.) is not needed and ignored. I couldn't set the cookies without it.
  const urlDomain =
    process.env.NODE_ENV === 'development'
      ? '.localhost'
      : `.${new URL(config.storeUrl).hostname}`

  return () => {
    let currentValue = getCookie(key)
    const isExpired = currentValue === undefined

    if (isExpired) {
      currentValue = randomUUID()
    }

    // Setting the `path=/` makes the cookie accessible on any path of the domain/subdomain
    document.cookie = `${key}=${currentValue}; max-age=${expiresSecond}; domain=${urlDomain}; path=/;`

    return currentValue
  }
}

const user = {
  anonymous: createOrRefreshCookie('vtex-search-anonymous', ONE_YEAR_S),
  session: createOrRefreshCookie('vtex-search-session', THIRTY_MINUTES_S),
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
  | {
      text: string
      misspelled: boolean
      match: number
      operator: string
      locale: string
      url: string
      type: 'search.autocomplete.query'
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
  event:
    | AnalyticsEvent
    | SearchSelectItemEvent
    | IntelligentSearchQueryEvent
    | IntelligentSearchAutocompleteQueryEvent
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

    case 'intelligent_search_autocomplete_query': {
      sendEvent({
        type: 'search.autocomplete.query',
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
