import { Product as ProductType } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import React, { FC, Suspense } from 'react'
import { useParams } from '@reach/router'
import useSWR from 'swr'

import Product from '../components/Product'
import ErrorBoundary from '../components/ErrorBoundary'

const DynamicProductData: FC<{ slug?: string }> = ({ slug }) => {
  const { data } = useSWR(
    `/api/catalog_system/pub/products/search/${slug}/p`,
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

interface Props {
  data?: {
    product: ProductType
  }
}

const ProductTemplate: FC<Props> = ({ data }) => {
  const maybeParams = useParams()
  const isStatic = !!data

  // If page was pre-rendered we have pre-rendered data
  if (isStatic) {
    return <Product data={data} />
  }

  // The page was not pre-rendered, we need to use params from
  // the url
  const { slug } = maybeParams

  return (
    <ErrorBoundary fallback={<div>Error!</div>}>
      <Suspense fallback={<div>loading...</div>}>
        <DynamicProductData slug={slug} />
      </Suspense>
    </ErrorBoundary>
  )
}

export default ProductTemplate
