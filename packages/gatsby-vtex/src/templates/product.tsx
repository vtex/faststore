import { graphql } from 'gatsby'
import React, { FC, Suspense } from 'react'
import { RouteComponentProps } from '@reach/router'
import useSWR from 'swr'

import Product from '../components/Product'
import ErrorBoundary from '../components/ErrorBoundary'

const ProductData: FC<{ slug?: string }> = ({ slug }) => {
  const {
    data,
  } = useSWR(
    `http://${process.env.GATSBY_VTEX_TENANT}.${process.env.GATSBY_VTEX_ENVIRONMENT}.com.br/api/catalog_system/pub/products/search/${slug}/p`,
    (url: string) => fetch(url).then((r) => r.json()),
    { suspense: true }
  )

  const [product] = data
  const result = { product }

  return <Product data={result} />
}

export const staticQuery = graphql`
  query($id: String!) {
    product(id: { eq: $id }) {
      productName
      items {
        images {
          imageUrl
        }
      }
    }
  }
`

interface Props extends RouteComponentProps {
  data?: any
  slug?: string
}

const ProductTemplate: FC<Props> = ({ data, slug }) => {
  const isStatic = !!data

  if (isStatic) {
    return <Product data={data} />
  }

  return (
    <ErrorBoundary fallback={<div>Error!</div>}>
      <Suspense fallback={<div>loading...</div>}>
        <ProductData slug={slug} />
      </Suspense>
    </ErrorBoundary>
  )
}

export default ProductTemplate
