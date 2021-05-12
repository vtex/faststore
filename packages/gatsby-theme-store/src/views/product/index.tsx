import { SuspenseViewport } from '@vtex/store-ui'
import React, { lazy } from 'react'
import type { FC } from 'react'

import { usePixelSendEvent } from '../../sdk/pixel/usePixelSendEvent'
import AboveTheFold from './AboveTheFold'
import BelowTheFoldPreview from './BelowTheFoldPreview'
import SEO from './SEO'
import type { ServerProductPageProps } from '../../templates/product.server'

const belowTheFoldPreloader = () => import('./BelowTheFold')
const BelowTheFold = lazy(belowTheFoldPreloader)

export type ProductViewProps = {
  data: ServerProductPageProps['data']
  slug: string
}

const ProductView: FC<ProductViewProps> = (props) => {
  const { data } = props

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
          product: data?.vtex.product,
        },
      },
    ],
    data?.vtex.product?.id ?? ''
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
