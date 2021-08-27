import { useEffect } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'

export interface Options<P> {
  product?: P
}

export const useProductPixel = <P extends { id: string }>({
  product,
}: Options<P>) =>
  useEffect(() => {
    const events = [
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
    ] as const

    events.forEach(sendPixelEvent)
  }, [product])
