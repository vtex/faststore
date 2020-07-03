import { api, Product as ProductType } from '@vtex/gatsby-source-vtex'
import React, { FC, Suspense } from 'react'
import useSWR from 'swr'

import DynamicProduct from '../../components/DynamicProduct'
import ErrorBoundary from '../../components/ErrorBoundary'
import Layout from '../../components/Layout'
import { isServer } from '../../utils/env'

interface Props {
  slug: string
}

const ClientOnlyView: FC<Props> = ({ slug }) => {
  const { data } = useSWR<ProductType[]>(
    api.search.bySlug(slug),
    (url: string) => fetch(url).then((r) => r.json()),
    { suspense: true }
  )
  const [product] = data!

  return <DynamicProduct staticProduct={product} />
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
