import { SuspenseViewport } from '@vtex/store-ui'
import React, { lazy } from 'react'
import type { PropsWithChildren } from 'react'

import { usePixelSendEvent } from '../../sdk/pixel/usePixelSendEvent'
import AboveTheFold from './AboveTheFold'
import BelowTheFoldPreview from './BelowTheFoldPreview'
import SEO from './SEO'

const belowTheFoldPreloader = () => import('./BelowTheFold')
const BelowTheFold = lazy(belowTheFoldPreloader)

export type ProductViewProps<P = Product> = PropsWithChildren<{
  product: P
  slug: string
}>

interface Product {
  id: string
}

const ProductView = <P extends Product>(props: ProductViewProps<P>) => {
  const { product } = props

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

  return (
    <>
      <SEO {...props} />
      <AboveTheFold {...props} />
      <SuspenseViewport
        fallback={<BelowTheFoldPreview />}
        preloader={belowTheFoldPreloader}
      >
        <BelowTheFold {...props} />
      </SuspenseViewport>
    </>
  )
}

export default ProductView
