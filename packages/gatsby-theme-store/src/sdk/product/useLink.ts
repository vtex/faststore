import type { MouseEvent } from 'react'
import { sendAnalyticsEvent } from '@vtex/store-sdk'

import { minimalToAnalyticsProduct } from '../pixel/events'
import type { MinimalProduct, PageType } from '../pixel/events'
import { useSku } from './useSku'
import { useUnprotectedSearch } from '../search/useSearch'

export interface UseLinkPixelData {
  /**
   * Type of page on which the link is present.
   *
   * @type {PageType}
   * @memberof UseLinkPixelData
   */
  pageType?: PageType
  /**
   * Main term that's being used at the full text search page.
   *
   * @type {string}
   * @memberof UseLinkPixelData
   */
  term?: string
  /**
   * The item's position on a list, usually a shelf or a product listing page.
   *
   * @type {number}
   * @memberof UseLinkPixelData
   */
  position?: number
}

export interface UseLinkOptions {
  /**
   * Pixel-related data to be used by the hook to fire events with proper analytics data.
   *
   * @type {UseLinkPixelData}
   * @memberof UseLinkOptions
   */
  pixelData?: UseLinkPixelData
}

export interface UseLinkProduct extends MinimalProduct {
  linkText: string
}

function getSearchPageType(term: string | null): PageType {
  return term ? 'fullTextSearch' : 'nonFullTextSearch'
}

/**
 * Given a product, returns the necessary properties for a component to link to the page of the product.
 *
 * @param {MinimalProduct} product The product to be used to extract the link.
 * @param {UseLinkOptions} [options] Hook options. Include position data to have accurate pixel events. Overriding default pageType and term values may be specially useful on recommendation shelves.
 * @returns `to` and `onClick` properties to be passed on to a link component.
 */
export const useLink = (product: UseLinkProduct, options?: UseLinkOptions) => {
  const [sku] = useSku(product)
  const searchContext = useUnprotectedSearch()

  const defaultTerm = searchContext?.searchParams.term ?? null
  const defaultPageType: PageType = searchContext
    ? getSearchPageType(defaultTerm)
    : 'other'

  const { pageType = defaultPageType, term = defaultTerm, position } =
    options?.pixelData ?? {}

  return {
    to: `/${product.linkText}/p?skuId=${sku.itemId}`,
    onClick: (_: MouseEvent<HTMLAnchorElement>) =>
      sendAnalyticsEvent({
        type: 'vtex:productClick',
        data: {
          pageType,
          term,
          position,
          product: minimalToAnalyticsProduct(product, sku),
        },
      }),
  }
}
