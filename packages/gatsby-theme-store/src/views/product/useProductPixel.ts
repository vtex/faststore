import { usePixelSendEvent } from '../../sdk/pixel/usePixelSendEvent'
import type { Product } from './types'

export interface Options {
  product?: Product
}

export const useProductPixel = ({ product }: Options) =>
  usePixelSendEvent(
    () => [
      {
        type: 'vtex:pageView',
        data: {
          pageType: 'pdp',
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer,
          accountName: process.env.GATSBY_STORE_ID!,
        },
      },
      {
        type: 'vtex:productView',
        data: {
          product,
        },
      },
    ],
    product?.id ?? ''
  )
