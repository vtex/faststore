import DataLoader from 'dataloader'
import pLimit from 'p-limit'

import type { Options } from '..'
import type { Clients } from '../clients'
import type {
  PortalPagetype,
  ValidPortalPagetype,
} from '../clients/commerce/types/Portal'
import { isValidPortalPageType } from '../resolvers/collection'

// Limits concurrent requests to 20 so that they don't timeout
const CONCURRENT_REQUESTS_MAX = 20

export function throwIfPageTypeNotFound(
  pageTypes: PromiseSettledResult<PortalPagetype>[],
  slugs: readonly string[]
): pageTypes is PromiseFulfilledResult<ValidPortalPagetype>[] {
  const notFoundIndexes: number[] = []
  const rejectedIndexes: number[] = []

  pageTypes.forEach((pageType, index) => {
    // If the request fails
    if (pageType.status === 'rejected') {
      rejectedIndexes.push(index)

      return
    }

    // If the catalog returns NotFound pageType
    if (!isValidPortalPageType(pageType.value)) {
      notFoundIndexes.push(index)
    }
  })

  if (notFoundIndexes.length + rejectedIndexes.length > 0) {
    let errorMessage = ''

    if (notFoundIndexes.length > 0) {
      errorMessage +=
        `Catalog returned NotFound pageType for the following slug(s): ${notFoundIndexes
          .map((i) => slugs[i])
          .join(', ')}.` +
        ' This usually happens when there is more than one category with' +
        ' the same name in the same category tree level.'

      errorMessage += '\n'
    }

    if (rejectedIndexes.length > 0) {
      errorMessage += `pageType request failed for the following slug(s): ${rejectedIndexes
        .map((i) => slugs[i])
        .join(', ')}.`

      errorMessage += '\n'
      errorMessage += rejectedIndexes
        .map((i) => (pageTypes[i] as PromiseRejectedResult).reason)
        .join(`\n`)
    }

    throw new Error(errorMessage)
  }

  return true
}

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
