import { graphql, PageProps } from 'gatsby'
import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl/react-intl-no-parser.umd'

import ErrorBoundary from '../components/ErrorBoundary'
import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import ProductDetails from '../components/ProductDetails'
import { useQuery } from '../sdk/graphql/useQuery'
import {
  ProductPageQuery,
  ProductPageQueryQuery,
  ProductPageQueryQueryVariables,
} from './__generated__/ProductPageQuery.graphql'

type Props = PageProps<
  ProductPageQueryQuery,
  ProductPageQueryQueryVariables
> & {
  slug?: string
}

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
    return <FormattedMessage id="product-not-found" />
  }

  return <ProductDetails product={data.vtex.product} />
}

const ProductPageContainer: FC<Props> = (props) => {
  const {
    pageContext: { staticPath },
  } = props

  return (
    <Layout>
      <HybridWrapper
        isPrerendered={staticPath}
        fallback={<FormattedMessage id="loading" />}
      >
        <ErrorBoundary fallback={<FormattedMessage id="error-generic" />}>
          <ProductPage {...props} />
        </ErrorBoundary>
      </HybridWrapper>
    </Layout>
  )
}

export const query = graphql`
  query ProductPageQuery($slug: String, $staticPath: Boolean!) {
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

export default ProductPageContainer
