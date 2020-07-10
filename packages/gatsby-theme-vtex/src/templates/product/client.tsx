import { api } from '@vtex/gatsby-source-vtex'
import React, { FC, Suspense } from 'react'
import useSWR from 'swr'

import ErrorBoundary from '../../components/ErrorBoundary'
import Layout from '../../components/Layout'
import ProductDetails from '../../components/ProductDetails'
import { SyncProduct } from '../../types/product'
import { isServer } from '../../utils/env'
import { jsonFetcher } from '../../utils/fetcher'

interface Props {
  slug: string
}

const ClientOnlyView: FC<Props> = ({ slug }) => {
  const { data } = useSWR<SyncProduct[]>(api.search({ slug }), {
    fetcher: jsonFetcher,
    suspense: true,
  })

  // Since we suspended in swr, it's safe to read data directly
  const [syncProduct] = data!

  return <ProductDetails syncProduct={syncProduct} />
}

const ProductPage: FC<Props> = (props) => {
  if (isServer) {
    return <Layout />
  }

  return (
    <Layout>
      <ErrorBoundary fallback={<div>Error!</div>}>
        <Suspense fallback={<div>loading...</div>}>
          <ClientOnlyView {...props} />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  )
}

export default ProductPage
