import React, { FC, Fragment, lazy } from 'react'
import { graphql, PageProps } from 'gatsby'

import ErrorBoundary from '../components/ErrorBoundary'
import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import AboveTheFold from '../components/ProductPage/AboveTheFold'
import AboveTheFoldPreview from '../components/ProductPage/AboveTheFoldPreview'
import BelowTheFoldPreview from '../components/ProductPage/BelowTheFoldPreview'
import SuspenseSSR from '../components/Suspense/SSR'
import SuspenseViewport from '../components/Suspense/Viewport'
import { useQuery } from '../sdk/graphql/useQuery'
import {
  ProductPageQuery,
  ProductPageQueryQuery,
  ProductPageQueryQueryVariables,
} from './__generated__/ProductPageQuery.graphql'

const loadBelowTheFold = () => import('../components/ProductPage/BelowTheFold')

const loadSEO = () => import('../components/ProductPage/SEO')

const BelowTheFold = lazy(loadBelowTheFold)
const SEO = lazy(loadSEO)

export type ProductPageProps = PageProps<
  ProductPageQueryQuery,
  ProductPageQueryQueryVariables
> & {
  slug?: string
}

const ProductPage: FC<ProductPageProps> = (props) => {
  const { data: initialData, pageContext, slug: routeSlug } = props
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

  const pageProps = {
    ...props,
    data,
    slug,
  }

  return (
    <Fragment>
      <AboveTheFold {...pageProps} />
      <SuspenseSSR fallback={null} hydration={false} preloader={loadSEO}>
        <SEO {...pageProps} data={data} />
      </SuspenseSSR>
      <SuspenseViewport
        fallback={<BelowTheFoldPreview />}
        preloader={loadBelowTheFold}
      >
        <BelowTheFold {...pageProps} />
      </SuspenseViewport>
    </Fragment>
  )
}

const Page: FC<ProductPageProps> = (props) => {
  const {
    pageContext: { staticPath },
  } = props

  return (
    <Layout>
      <HybridWrapper
        isPrerendered={staticPath}
        fallback={<AboveTheFoldPreview />}
      >
        <ErrorBoundary fallback={<div>Error !!</div>}>
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
        ...StructuredProductFragment_product
        productId
        description
        categoryTree {
          name
          href
        }
        items {
          itemId
        }
      }
    }
  }
`

export default Page
