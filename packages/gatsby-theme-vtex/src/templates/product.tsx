/* eslint-disable react/jsx-pascal-case */
import React, { FC, Fragment, lazy } from 'react'
import { graphql, PageProps } from 'gatsby'

import ErrorBoundary from '../components/Error/ErrorBoundary'
import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import AboveTheFold from '../components/ProductPage/AboveTheFold'
import AboveTheFoldPreview from '../components/ProductPage/AboveTheFoldPreview'
import BelowTheFoldPreview from '../components/ProductPage/BelowTheFoldPreview'
import SuspenseViewport from '../components/Suspense/Viewport'
import { useQuery } from '../sdk/graphql/useQuery'
import {
  ProductPageQuery,
  ProductPageQueryQuery,
  ProductPageQueryQueryVariables,
} from './__generated__/ProductPageQuery.graphql'
import SEO from '../components/ProductPage/SEO'
import ErrorHandler from '../components/Error/ErrorHandler'
import { usePixelSendEvent } from '../sdk/pixel/usePixelSendEvent'

const belowTheFoldPreloader = () =>
  import('../components/ProductPage/BelowTheFold')

const BelowTheFold = lazy(belowTheFoldPreloader)

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

  usePixelSendEvent(
    () => [
      {
        type: 'vtex:pageView',
        data: {
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer,
          accountName: process.env.GATSBY_VTEX_TENANT!,
        },
      },
      {
        type: 'vtex:productView',
        data: {
          product: data?.vtex.product,
        },
      },
    ],
    data?.vtex.product?.productId ?? ''
  )

  const pageProps = {
    ...props,
    data: data!,
    slug,
  }

  return (
    <Fragment>
      <AboveTheFold {...pageProps} />
      <SEO {...pageProps} />
      <SuspenseViewport
        fallback={<BelowTheFoldPreview />}
        preloader={belowTheFoldPreloader}
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
    <ErrorBoundary fallback={(error) => <ErrorHandler error={error} />}>
      <Layout>
        <HybridWrapper
          isPrerendered={staticPath}
          fallback={<AboveTheFoldPreview />}
        >
          <ProductPage {...props} />
        </HybridWrapper>
      </Layout>
    </ErrorBoundary>
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
      }
    }
  }
`

export default Page
