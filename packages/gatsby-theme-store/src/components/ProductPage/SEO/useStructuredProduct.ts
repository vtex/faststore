import { graphql, useStaticQuery } from 'gatsby'
import { useMemo } from 'react'
import type { Offer } from 'schema-dts'

import type { StructuredProductFragment_ProductFragment } from './__generated__/StructuredProductFragment_product.graphql'
import type { StructuredProductSiteMetadataQueryQuery } from './__generated__/StructuredProductSiteMetadataQuery.graphql'

type SKU = NonNullable<
  ArrayItem<NonNullable<StructuredProductFragment_ProductFragment['items']>>
>

const getSkuOffers = (
  sku: SKU,
  currency: string,
  url: string
): Maybe<Offer[]> =>
  sku.sellers?.map((seller) => ({
    '@type': 'Offer',
    price: seller!.commercialOffer!.price!,
    priceCurrency: currency,
    url,
    priceValidUntil: `${seller!.commercialOffer!.priceValidUntil}`.slice(0, 10),
    availability:
      seller!.commercialOffer!.availableQuantity! > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
  }))

export const useStructuredProduct = (
  product: StructuredProductFragment_ProductFragment,
  currency: string
) => {
  const { site } = useStaticQuery<StructuredProductSiteMetadataQueryQuery>(
    graphql`
      query StructuredProductSiteMetadataQuery {
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  )

  const siteUrl = site?.siteMetadata?.siteUrl

  return useMemo(() => {
    if (product === null) {
      return ''
    }

    const { productName, items, description, brand, linkText } = product

    const [sku] = items!
    const images = sku!.images!.map((i) => i!.imageUrl)
    const url = `${siteUrl}/${linkText}/p`
    const offers = getSkuOffers(sku!, currency, url)

    if (!sku || !images || !offers || offers.length === 0 || !brand) {
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
      gtin13: sku.ean,
      description,
    }
  }, [product, currency, siteUrl])
}

export const fragment = graphql`
  fragment StructuredProductFragment_product on VTEX_Product {
    productName
    description
    brand
    linkText
    items {
      itemId
      ean
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
