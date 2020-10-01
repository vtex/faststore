/** @jsx jsx */
import { graphql } from 'gatsby'
import { FC } from 'react'
import { jsx } from '@vtex/store-ui'

import { ProductSummary_ProductFragment } from './__generated__/ProductSummary_product.graphql'

interface Props {
  product: ProductSummary_ProductFragment
  loading?: 'lazy' | 'eager'
  variant?: string
}

const ProductSummary: FC<Props> = () => {
  return <div>Product Summary</div>
}

export const fragment = graphql`
  fragment ProductSummary_product on VTEX_Product {
    productId
    productName
    linkText
    productClusters {
      name
    }
    items {
      itemId
      images {
        imageUrl
        imageText
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
