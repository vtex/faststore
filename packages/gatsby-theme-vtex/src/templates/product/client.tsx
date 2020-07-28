import React, { FC, Suspense } from 'react'
import useSWR from 'swr'

import Container from '../../components/Container'
import ErrorBoundary from '../../components/ErrorBoundary'
import Layout from '../../components/Layout'
import ProductDetails from '../../components/ProductDetails'
import { SyncProduct } from '../../types/product'
import { isServer } from '../../utils/env'
import graphqlFetcher from '../../utils/graphqlFetcher'

const query = `
query GetProduct($slug: String) {
  product(slug: $slug) {
    productId
    productName
    description
    linkText
    items {
      itemId
      images {
        imageUrl
        imageText
      }
    }
  }
}
`

const fetcher = async (slug: string) => {
  const { data } = await graphqlFetcher(query, { slug })

  return data.product
}

interface Props {
  slug: string
}

const ClientOnlyView: FC<Props> = ({ slug }) => {
  const { data: syncProduct } = useSWR<SyncProduct>(slug, {
    fetcher,
    suspense: true,
  })

  return (
    <Container>
      <ProductDetails syncProduct={syncProduct!} />
    </Container>
  )
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
