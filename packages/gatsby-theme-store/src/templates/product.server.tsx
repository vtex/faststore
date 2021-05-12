import { graphql } from 'gatsby'
import React from 'react'
import type { PageProps } from 'gatsby'
import type { FC } from 'react'

import Layout from '../components/Layout'
import ProductView from '../views/product'
import type {
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables,
} from './__generated__/ServerProductPageQuery.graphql'

export type ServerProductPageProps = PageProps<
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables
>

const Page: FC<ServerProductPageProps> = (props) => (
  <Layout>
    <ProductView {...props} slug={props.pageContext.slug} />
  </Layout>
)

export const query = graphql`
  query ServerProductPageQuery($slug: String!) {
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
