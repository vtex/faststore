import { graphql } from 'gatsby'
import React, { lazy } from 'react'
import type { PageProps } from 'gatsby'
import type { FC } from 'react'

import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import AboveTheFold from '../components/ProductPage/AboveTheFold'
import AboveTheFoldPreview from '../components/ProductPage/AboveTheFoldPreview'
import BelowTheFoldPreview from '../components/ProductPage/BelowTheFoldPreview'
import SEO from '../components/ProductPage/SEO'
import SuspenseViewport from '../components/Suspense/Viewport'
import { useQuery } from '../sdk/graphql/useQuery'
import { usePixelSendEvent } from '../sdk/pixel/usePixelSendEvent'
import { ProductPageQuery } from './__generated__/ProductPageQuery.graphql'
import type {
  ProductPageQueryQuery,
  ProductPageQueryQueryVariables,
} from './__generated__/ProductPageQuery.graphql'

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
          pageType: 'pdp',
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer,
          accountName: process.env.GATSBY_STORE_ID!,
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
    <>
      <SEO {...pageProps} />
      <AboveTheFold {...pageProps} />
      <SuspenseViewport
        fallback={<BelowTheFoldPreview />}
        preloader={belowTheFoldPreloader}
      >
        <BelowTheFold {...pageProps} />
      </SuspenseViewport>
    </>
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
        <ProductPage {...props} />
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
        titleTag
        metaTagDescription
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
