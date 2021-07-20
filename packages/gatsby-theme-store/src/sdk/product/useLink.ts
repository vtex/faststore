import type { MouseEvent } from 'react'

import { minimalToPixelProduct } from '../pixel/events'
import type { MinimalProduct } from '../pixel/events'
import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import { useSku } from './useSku'

export type SearchMap = 'ft' | 'c' | 'b'

export interface UseLinkPixelData {
  /**
   * Type of product listing page query that's being made.
   *
   * @type {SearchMap}
   * @memberof UseLinkPixelData
   */
  map?: SearchMap
  /**
   * Main term that's being used at the product listing page query.
   *
   * @type {string}
   * @memberof UseLinkPixelData
   */
  query?: string
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

/**
 * Given a product, returns the necessary properties for a component to link to the page of the product.
 *
 * @param {MinimalProduct} product The product to be used to extract the link.
 * @param {UseLinkOptions} [options] Hook options. Include pixel-related data whenever possible. This is specially useful on shelves or product listing pages.
 * @returns `to` and `onClick` properties to be passed on to a link component.
 */
export const useLink = (product: UseLinkProduct, options: UseLinkOptions) => {
  const [sku] = useSku(product)
  const { pixelData = {} } = options ?? {}

  return {
    to: `/${product.linkText}/p?skuId=${sku.itemId}`,
    onClick: (_: MouseEvent<HTMLAnchorElement>) =>
      sendPixelEvent({
        type: 'vtex:productClick',
        data: {
          ...pixelData,
          product: minimalToPixelProduct(product, sku),
        },
      }),
  }
}
