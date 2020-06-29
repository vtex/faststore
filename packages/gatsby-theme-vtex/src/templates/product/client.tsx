import React, { FC, Suspense } from 'react'
import useSWR from 'swr'

import ErrorBoundary from '../../components/ErrorBoundary'
import Layout from '../../components/Layout'
import Product from '../../components/Product'
import { urls } from '../../utils/api'
import { isServer } from '../../utils/env'

interface Props {
  slug: string
}

const DynamicView: FC<Props> = ({ slug }) => {
  const {
    data: [product],
  } = useSWR(
    urls.product(slug),
    (url: string) => fetch(url).then((r) => r.json()),
    { suspense: true }
  )

  return <Product data={{ product }} />
}

const ProductPage: FC<Props> = (props) => {
  if (isServer) {
    return <Layout />
  }

  return (
    <Layout>
      <ErrorBoundary fallback={<div>Error!</div>}>
        <Suspense fallback={<div>loading...</div>}>
          <DynamicView {...props} />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  )
}

export default ProductPage
