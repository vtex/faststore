import DataLoader from 'dataloader'
import pLimit from 'p-limit'

import type { Options } from '..'
import type { Clients } from '../clients'
import type { PortalPagetype } from '../clients/commerce/types/Portal'

// Limits concurrent requests to 20 so that they don't timeout
const CONCURRENT_REQUESTS_MAX = 20

export const getPagetypeLoader = (_: Options, clients: Clients) => {
  const limit = pLimit(CONCURRENT_REQUESTS_MAX)

  const loader = (slugs: readonly string[]) => {
    return Promise.all(
      slugs.map((s: string) =>
        limit(() => clients.commerce.catalog.portal.pagetype(s))
      )
    )
  }

  return new DataLoader<string, PortalPagetype>(loader, {
    // DataLoader is being used to cache requests, not to batch them
    batch: false,
  })
}
