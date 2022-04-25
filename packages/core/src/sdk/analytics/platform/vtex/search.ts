/**
 * More info at: https://www.notion.so/vtexhandbook/Event-API-Documentation-48eee26730cf4d7f80f8fd7262231f84
 */
import type { AnalyticsEvent } from '@faststore/sdk'

import config from '../../../../../store.config'
import type { SearchSelectItemEvent } from '../../types'

const THIRTY_MINUTES_S = 30 * 60
const ONE_YEAR_S = 365 * 24 * 3600

const randomUUID = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : (Math.random() * 1e6).toFixed(0)

const createStorage = (key: string, expiresSecond: number) => {
  const timelapsed = (past: number) => (Date.now() - past) / 1e3

  return () => {
    const item = JSON.parse(localStorage.getItem(key) ?? 'null')
    const isExpired = !item || timelapsed(item.createdAt) > expiresSecond
    const payload: string = isExpired ? randomUUID() : item.payload

    if (isExpired) {
      const data = { payload, createdAt: Date.now() }

      localStorage.setItem(key, JSON.stringify(data))
    }

    return payload
  }
}

const user = {
  anonymous: createStorage('vtex.search.anonymous', ONE_YEAR_S),
  session: createStorage('vtex.search.session', THIRTY_MINUTES_S),
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

const handleEvent = (event: AnalyticsEvent | SearchSelectItemEvent) => {
  if (event.name !== 'search_select_item') {
    return
  }

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
}

setInterval(
  () => sendEvent({ type: 'session.ping' }),
  60 * 1e3 /* One minute */
)

export default handleEvent
