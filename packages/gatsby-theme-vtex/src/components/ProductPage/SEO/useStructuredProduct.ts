import { graphql } from 'gatsby'
import { useMemo } from 'react'
import { ItemAvailability, Offer } from 'schema-dts'

import { StructuredProductFragment_ProductFragment } from './__generated__/StructuredProductFragment_product.graphql'

type SKU = NonNullable<
  ArrayItem<NonNullable<StructuredProductFragment_ProductFragment['items']>>
>

const getSkuOffers = (sku: SKU, currency: string): Offer[] =>
  sku.sellers!.map((seller) => ({
    '@type': 'Offer',
    price: seller!.commercialOffer!.price!,
    priceCurrency: currency,
    priceValidUntil: `${seller!.commercialOffer!.priceValidUntil}`,
    availability:
      seller!.commercialOffer!.availableQuantity! > 0
        ? ItemAvailability.InStock
        : ItemAvailability.OutOfStock,
  }))

export const useStructuredProduct = (
  product: StructuredProductFragment_ProductFragment,
  currency: string
) =>
  useMemo(() => {
    if (product === null) {
      return ''
    }

    const { productName, items, description, brand } = product

    const [sku] = items!
    const images = sku!.images!.map((i) => i!.imageUrl)
    const offers = getSkuOffers(sku!, currency)

    if (!sku || !images || offers.length === 0 || !brand) {
      return null
    }

    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: productName,
      image: images,
      offers,
      sku: sku.itemId,
      brand: {
        '@type': 'Brand',
        name: brand,
      },
      description,
    }
  }, [product, currency])

export const fragment = graphql`
  fragment StructuredProductFragment_product on VTEX_Product {
    productName
    description
    brand
    items {
      itemId
      images {
        imageUrl
      }
      sellers {
        commercialOffer: commertialOffer {
          price: Price
          availableQuantity: AvailableQuantity
          priceValidUntil: PriceValidUntil
        }
      }
    }
  }
`
