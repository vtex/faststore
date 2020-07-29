import React, { FC } from 'react'
import { graphql, PageProps } from 'gatsby'
import useSWR from 'swr'

import Layout from '../components/Layout'
import ProductDetails from '../components/ProductDetails'
import { SyncProduct } from '../types/product'
import { isServer } from '../utils/env'
import fetcher from '../graphql/fetcher'
import ErrorBoundary from '../components/ErrorBoundary'

export const query = graphql`
  query GetProduct($slug: String, $withProduct: Boolean = true) {
    vtex {
      product(slug: $slug) @include(if: $withProduct) {
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
  const { withProduct, pageQuery } = pageContext
  const slug = (pageContext.slug ?? routeSlug)!

  const { data: product } = useSWR<SyncProduct | null>(slug, {
    fetcher: (s: string) =>
      fetcher(pageQuery, { slug: s, withProduct: true }).then(
        (x: any) => x.data.product
      ),
    suspense: true,
    initialData: withProduct ? data.vtex.product : undefined,
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
    withProduct: boolean
    pageQuery: string
  }
> & {
  slug?: string
}

const ProductPageSSR: FC<Props> = (props) => {
  const {
    pageContext: { withProduct },
  } = props

  if (isServer && !withProduct) {
    return <Layout />
  }

  return (
    <Layout>
      <ErrorBoundary fallback={<div>Error!</div>}>
        <ProductPage {...props} />
      </ErrorBoundary>
    </Layout>
  )
}

export default ProductPageSSR
