import { Center, Flex, Text } from '@vtex/store-ui'
import { graphql } from 'gatsby'
import React from 'react'
import type { FC } from 'react'

import type { ProductSummary_ProductFragment } from './__generated__/ProductSummary_product.graphql'

export interface Props {
  product: ProductSummary_ProductFragment
  loading?: 'lazy' | 'eager'
  variant?: string
}

const ProductSummary: FC<Props> = () => (
  <Flex sx={{ flexWrap: 'wrap' }}>
    <Center height="50px">
      <Text>This is the product summary component</Text>
    </Center>
    <Center height="120px">
      <Text>
        This component is used in many different parts of your store, like in
        the shelf and search results
      </Text>
    </Center>
    <Center height="120px">
      <Text>
        Base building blocks are available in <strong>@vtex/store-ui</strong>.
        Use them to create your own cusstom version of product summary via
        Shadowing.
      </Text>
    </Center>
  </Flex>
)

export const fragment = graphql`
  fragment ProductSummary_product on VTEX_Product {
    id: productId
    productName
    linkText
    items {
      itemId
      images {
        imageUrl
        imageText
      }
      productClusters {
        id
        name
      }
      sellers {
        sellerId
        commercialOffer: commertialOffer {
          maxInstallments: Installments(criteria: MAX_WITHOUT_INTEREST) {
            value: Value
            numberOfInstallments: NumberOfInstallments
          }
          installments: Installments(criteria: ALL) {
            value: Value
            numberOfInstallments: NumberOfInstallments
            interestRate: InterestRate
          }
          availableQuantity: AvailableQuantity
          price: Price
          listPrice: ListPrice
          spotPrice
          teasers {
            name
          }
        }
      }
    }
  }
`

export default ProductSummary
