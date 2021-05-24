import { gql } from '@vtex/gatsby-plugin-graphql'
import { SuspenseSSR } from '@vtex/store-ui'
import React from 'react'
import { useMatch } from '@reach/router'
import type { PageProps } from 'gatsby'
import type { FC } from 'react'

import Layout from '../components/Layout'
import { useQuery } from '../sdk/graphql/useQuery'
import ProductView from '../views/product'
import AboveTheFoldPreview from '../views/product/AboveTheFoldPreview'
import { BrowserProductPageQuery } from './__generated__/BrowserProductPageQuery.graphql'
import type {
  BrowserProductPageQueryQuery,
  BrowserProductPageQueryQueryVariables,
} from './__generated__/BrowserProductPageQuery.graphql'

export type BrowserProductPageProps = PageProps

const ProductPage: FC<BrowserProductPageProps> = (props) => {
  const { slug } = useMatch(props.pageResources.page.matchPath!)!

  const { data } = useQuery<
    BrowserProductPageQueryQuery,
    BrowserProductPageQueryQueryVariables
  >({
    ...BrowserProductPageQuery,
    variables: { slug },
    suspense: true,
  })

  return <ProductView {...props} data={data!} slug={slug} />
}

const Page: FC<BrowserProductPageProps> = (props) => (
  <Layout>
    <SuspenseSSR fallback={<AboveTheFoldPreview />}>
      <ProductPage {...props} />
    </SuspenseSSR>
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
