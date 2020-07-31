import React, { FC } from 'react'
import { graphql, PageProps } from 'gatsby'
import useSWR from 'swr'

import Layout from '../components/Layout'
import ProductDetails from '../components/ProductDetails'
import { SyncProduct } from '../types/product'
import { graphqlFetcher } from '../graphql/fetcher'
import ErrorBoundary from '../components/ErrorBoundary'
import HybridWrapper from '../components/HybridWrapper'

export const query = graphql`
  query GetProduct($slug: String, $staticPath: Boolean = true) {
    vtex {
      product(slug: $slug) @include(if: $staticPath) {
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
  }
`

const ProductPage: FC<Props> = ({ data, pageContext, slug: routeSlug }) => {
  const { staticPath, pageQuery } = pageContext
  const slug = (pageContext.slug ?? routeSlug)!

  const { data: product } = useSWR<SyncProduct | null>(slug, {
    fetcher: (s: string) =>
      graphqlFetcher(pageQuery, { slug: s, staticPath: true }).then(
        (x: any) => x.data.product
      ),
    suspense: true,
    initialData: staticPath ? data.vtex.product : undefined,
  })

  return <ProductDetails syncProduct={product!} />
}

type Props = PageProps<
  {
    vtex: {
      product: SyncProduct
    }
  },
  {
    slug?: string
    staticPath: boolean
    pageQuery: string
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
