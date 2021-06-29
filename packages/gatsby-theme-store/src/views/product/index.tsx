import { SuspenseViewport } from '@vtex/store-ui'
import React, { lazy } from 'react'
import type { FC } from 'react'

import { usePixelSendEvent } from '../../sdk/pixel/usePixelSendEvent'
import AboveTheFold from './AboveTheFold'
import BelowTheFoldPreview from './BelowTheFoldPreview'
import SEO from './SEO'
import type { ServerProductPageProps } from '../../pages/{StoreProduct.slug}/p'

const belowTheFoldPreloader = () => import('./BelowTheFold')
const BelowTheFold = lazy(belowTheFoldPreloader)

export type ProductViewProps = {
  product: ServerProductPageProps['data']['product']
  slug: string
}

const ProductView: FC<ProductViewProps> = (props) => {
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
