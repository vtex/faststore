import { graphql, PageProps } from 'gatsby'
import React, { FC, Fragment } from 'react'

import Layout from '../components/Layout'
import AboveTheFold from '../components/ProductPage/AboveTheFold'
import BelowTheFold from '../components/ProductPage/BelowTheFold'
import SEO from '../components/ProductPage/SEO'
import { useQuery } from '../sdk/graphql/useQuery'
import {
  ProductPageQuery,
  ProductPageQueryQuery,
  ProductPageQueryQueryVariables,
} from './__generated__/ProductPageQuery.graphql'

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

  const { data, isValidating } = useQuery<
    ProductPageQueryQuery,
    ProductPageQueryQueryVariables
  >({
    ...ProductPageQuery,
    variables: { slug, staticPath: true },
    // suspense: true,
    initialData: staticPath ? initialData : undefined,
  })

  if (isValidating) {
    return <div>loading...</div>
  }

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
      <SEO {...pageProps} data={data} />
      <BelowTheFold {...pageProps} />
      {/* <SuspenseViewport
        fallback={<BelowTheFoldPreview />}
        preloader={belowTheFoldPreloader}
      >
      </SuspenseViewport> */}
    </Fragment>
  )
}

const Page: FC<ProductPageProps> = (props) => {
  const {
    pageContext: { staticPath },
  } = props

  return (
    <Layout>
      <ProductPage {...props} />
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
