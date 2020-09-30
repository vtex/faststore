/** @jsx jsx */
import { graphql } from 'gatsby'
import { FC } from 'react'
import { jsx } from '@vtex/store-ui'

import { ProductSummary_ProductFragment } from './__generated__/ProductSummary_product.graphql'
import BuyButton from '../BuyButton'
import ProductSummaryImage from './Image'
import ProductSummaryContainer from './Container'
import ProductSummaryTitle from './Title'
import { useBestSeller } from '../../sdk/product/useBestSeller'
import Offer from '../Offer/index'
import OfferPreview from '../Offer/Preview'

interface Props {
  product: ProductSummary_ProductFragment
  loading?: 'lazy' | 'eager'
  variant?: string
}

const ProductSummary: FC<Props> = ({ product, loading = 'lazy', variant = 'productSummary' }) => {
  const { linkText, items, productName } = product as any
  const [sku] = items
  const { images } = sku
  const [{ imageUrl, imageText }] = images
  const seller: any = useBestSeller(sku)

  return (
    <ProductSummaryContainer linkText={linkText}>
      <ProductSummaryImage
        src={imageUrl}
        alt={imageText ?? 'Product Image'}
        loading={loading}
      />
      <ProductSummaryTitle>{productName}</ProductSummaryTitle>
      {seller ? (
        <Offer commercialOffer={seller.commercialOffer} />
      ) : (
        <OfferPreview />
      )}
      <BuyButton sku={sku} />
    </ProductSummaryContainer>
  )
}

export const fragment = graphql`
  fragment ProductSummary_product on VTEX_Product {
    productId
    productName
    description
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
          maxInstallments: Installments(criteria: ALL) {
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
