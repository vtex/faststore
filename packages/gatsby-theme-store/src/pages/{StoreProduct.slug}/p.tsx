import { graphql } from 'gatsby'
import React from 'react'
import type { PageProps } from 'gatsby'
import type { FC } from 'react'

import Layout from '../../components/Layout'
import ProductView from '../../views/product'
import type {
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables,
} from '../../{StoreProduct.slug}/__generated__/ServerProductPageQuery.graphql'

export type ServerProductPageProps = PageProps<
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables
>

const Page: FC<ServerProductPageProps> = (props) => (
  <Layout>
    <ProductView
      {...props}
      product={props.data.product}
      slug={props.params.slug}
    />
  </Layout>
)

export const query = graphql`
  query ServerProductPageQuery($id: String!) {
    product: storeProduct(id: { eq: $id }) {
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
`

export default Page
