/** @jsx jsx */
import { graphql } from 'gatsby'
import { FC, Fragment } from 'react'
import { jsx } from '@vtex/store-ui'
import Skeleton from 'react-loading-skeleton'

import { ProductSummary_ProductFragment } from './__generated__/ProductSummary_product.graphql'
import BuyButton from '../BuyButton'
import ProductSummaryImage from './Image'
import ProductSummaryContainer from './Container'
import ProductSummaryTitle from './Title'
import { useBestSeller } from '../../sdk/product/useBestSeller'
import Offer from '../Offer/index'
import OfferContainer from '../Offer/Container'

interface Props {
  product: ProductSummary_ProductFragment
  loading?: 'lazy' | 'eager'
  variant?: string
}

const OfferPreview = () => (
  <Fragment>
    <Skeleton height={20} />
    <Skeleton height={23} />
    <Skeleton height={20} />
  </Fragment>
)

const ProductSummary: FC<Props> = ({
  product,
  loading = 'lazy',
  variant = 'productSummary',
}) => {
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
      <OfferContainer variant={variant}>
        {seller ? (
          <Offer variant={variant} commercialOffer={seller.commercialOffer} />
        ) : (
          <OfferPreview />
        )}
      </OfferContainer>
      <BuyButton sku={sku} />
    </ProductSummaryContainer>
  )
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
