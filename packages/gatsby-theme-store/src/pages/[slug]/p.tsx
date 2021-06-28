import { gql } from '@vtex/gatsby-plugin-graphql'
import React from 'react'
import type { PageProps } from 'gatsby'
import type { FC } from 'react'

import HybridWrapper from '../../components/HybridWrapper'
import Layout from '../../components/Layout'
import { useQuery } from '../../sdk/graphql/useQuery'
import ProductView from '../../views/product'
import AboveTheFoldPreview from '../../views/product/AboveTheFoldPreview'
import { BrowserProductPageQuery } from '../../[slug]/__generated__/BrowserProductPageQuery.graphql'
import type {
  BrowserProductPageQueryQuery,
  BrowserProductPageQueryQueryVariables,
} from '../../[slug]/__generated__/BrowserProductPageQuery.graphql'

export type BrowserProductPageProps = PageProps & { slug: string }

const ProductPage: FC<BrowserProductPageProps> = (props) => {
  const { data } = useQuery<
    BrowserProductPageQueryQuery,
    BrowserProductPageQueryQueryVariables
  >({
    ...BrowserProductPageQuery,
    variables: { slug: props.slug },
    suspense: true,
  })

  return (
    <ProductView {...props} product={data?.vtex.product} slug={props.slug} />
  )
}

const Page: FC<BrowserProductPageProps> = (props) => (
  <Layout>
    <HybridWrapper fallback={<AboveTheFoldPreview />}>
      <ProductPage {...props} />
    </HybridWrapper>
  </Layout>
)

export const query = gql`
  query BrowserProductPageQuery($slug: String!) {
    vtex {
      product(slug: $slug) {
        ...ProductDetailsTemplate_product
        ...StructuredProductFragment_product
        titleTag
        metaTagDescription
        id: productId
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
