import { graphql, PageProps } from 'gatsby'
import React, { FC } from 'react'

import ErrorBoundary from '../components/ErrorBoundary'
import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import ProductDetails from '../components/ProductDetails'
import { useQuery } from '../hooks/useQuery'
import {
  ProductPageQuery,
  ProductPageQueryQuery,
  ProductPageQueryQueryVariables,
} from './__generated__/ProductPageQuery.graphql'

export const query = graphql`
  query ProductPageQuery($slug: String, $staticPath: Boolean = true) {
    vtex {
      product(slug: $slug) @include(if: $staticPath) {
        ...ProductDetailsTemplate_product
        productId
        description
        items {
          itemId
        }
      }
    }
  }
`

const ProductPage: FC<Props> = ({
  data: initialData,
  pageContext,
  slug: routeSlug,
}) => {
  const { staticPath } = pageContext
  const slug = (pageContext.slug ?? routeSlug)!

  const { data } = useQuery<
    ProductPageQueryQuery,
    ProductPageQueryQueryVariables
  >({
    ...ProductPageQuery,
    variables: { slug, staticPath: true },
    suspense: true,
    initialData: staticPath ? initialData : undefined,
  })

  if (!data?.vtex.product) {
    return <div>Product Not Found</div>
  }

  return <ProductDetails product={data?.vtex.product} />
}

type Props = PageProps<
  ProductPageQueryQuery,
  {
    slug?: string
    staticPath: boolean
  }
> & {
  slug?: string
}

const ProductPageSSR: FC<Props> = (props) => {
  const {
    pageContext: { staticPath },
  } = props

  return (
    <Layout>
      <HybridWrapper
        isPrerendered={staticPath}
        fallback={<div>loading...</div>}
      >
        <ErrorBoundary fallback={<div>Error !!</div>}>
          <ProductPage {...props} />
        </ErrorBoundary>
      </HybridWrapper>
    </Layout>
  )
}

export default ProductPageSSR
