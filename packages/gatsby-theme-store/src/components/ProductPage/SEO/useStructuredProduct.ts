import { useLocation } from '@gatsbyjs/reach-router'
import { graphql } from 'gatsby'
import { useMemo } from 'react'
import type { Offer } from 'schema-dts'

import { useCanonical } from './Canonical'
import type { StructuredProductFragment_ProductFragment } from './__generated__/StructuredProductFragment_product.graphql'

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
    priceValidUntil: seller!.commercialOffer!.priceValidUntil?.slice(0, 10),
    availability:
      seller!.commercialOffer!.availableQuantity! > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
  }))

export const useStructuredProduct = (
  product: StructuredProductFragment_ProductFragment,
  currency: string
) => {
  const canonical = useCanonical()
  const { host } = useLocation()

  const structuredData = []

  const productData = useMemo(() => {
    if (product === null) {
      return null
    }

    const { productName, items, description, brand } = product

    const [sku] = items!
    const images = sku!.images!.map((i) => i!.imageUrl)
    const offers = getSkuOffers(sku!, currency, canonical)

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
  }, [product, currency, canonical])

  if (productData !== null) {
    structuredData.push(productData)
  }

  const breadcrumbData = useMemo(() => {
    if (
      product === null ||
      product.categoryTree == null ||
      product.categoryTree.length === 0
    ) {
      return null
    }

    const { categoryTree, productName } = product

    const itemListElement = categoryTree.map((item, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item!.name!,
      item: `https://${host}/${item!.href}`,
    }))

    itemListElement.push({
      '@type': 'ListItem',
      position: (itemListElement.length as number) + 1,
      name: productName!,
      item: canonical,
    })

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    }
  }, [canonical, host, product])

  if (breadcrumbData !== null) {
    structuredData.push(breadcrumbData)
  }

  return structuredData
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
    categoryTree {
      href
      name
    }
  }
`
