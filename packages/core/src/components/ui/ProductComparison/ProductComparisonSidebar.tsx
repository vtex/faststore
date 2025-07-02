import React, { useCallback, useEffect } from 'react'
import {
  type IProductComparison,
  type ProductComparisonSidebarProps as UIProductComparisonSidebarProps,
  ProductComparisonSidebar as UIProductComparisonSidebar,
  useProductComparison,
} from '@faststore/ui'

import { gql } from '@generated/gql'
import type { ClientManyProductsSelectedQueryQuery } from '@generated/graphql'

import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useProductsSelected } from 'src/sdk/product/useProductsSelected'

const sortOptions = [
  {
    value: 'productByName',
    label: 'Product Name',
    onChange: (productComparison: IProductComparison[]) =>
      productComparison.sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    value: 'productByPrice',
    label: 'Price',
    onChange: (productComparison: IProductComparison[]) =>
      productComparison.sort((a, b) => a.offers.lowPrice - b.offers.lowPrice),
  },
] as const

export type SortOptions = (typeof sortOptions)[number]

interface ProductComparisonSidebarProps
  extends UIProductComparisonSidebarProps {}

function ProductComparisonSidebar(props: ProductComparisonSidebarProps) {
  const { productIds, products, isOpen, handleProductsComparison } =
    useProductComparison()
  const [productIdToBuy, setProductIdToBuy] = React.useState<string | null>(
    null
  )
  const [pendingEvent, setPendingEvent] = React.useState<
    React.MouseEvent<HTMLButtonElement>
  >({
    currentTarget: {} as HTMLButtonElement,
    preventDefault: () => {},
  } as React.MouseEvent<HTMLButtonElement>)

  function processResponse(data: ClientManyProductsSelectedQueryQuery) {
    const formattedData: IProductComparison[] = data.products.map((product) => {
      const skuSpecifications = product.skuSpecifications.map(
        (skuSpecification) => ({
          field: skuSpecification.field.name,
          values: skuSpecification.values.map((value) => value.name),
        })
      )

      return {
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        gtin: product.gtin,
        id: product.id,
        unitMultiplier: product.unitMultiplier,
        brand: { name: product.brand.name, brandName: product.brand.name },
        isVariantOf: {
          productGroupID: product.isVariantOf.productGroupID,
          name: product.isVariantOf.name,
          skuVariants: product.isVariantOf.skuVariants,
        },
        image: product.image,
        offers: {
          lowPrice: product.offers.lowPrice,
          lowPriceWithTaxes: product.offers.lowPriceWithTaxes,
          offers: product.offers.offers.map((offer) => ({
            availability: offer.availability,
            price: offer.price,
            listPrice: offer.listPrice,
            listPriceWithTaxes: offer.listPriceWithTaxes,
            priceWithTaxes: offer.priceWithTaxes,
            quantity: offer.quantity,
            seller: { identifier: offer.seller.identifier },
          })),
        },
        additionalProperty: product.additionalProperty.map((property) => ({
          propertyID: property.propertyID,
          name: property.name,
          value: property.value,
          valueReference: property.valueReference,
        })),
        advertisement: product.advertisement,
        hasSpecifications: product.hasSpecifications,
        skuSpecifications,
      }
    })

    handleProductsComparison(formattedData)
  }

  const buyButtonProps = React.useMemo(() => {
    return products
      .map((product: IProductComparison) => {
        const {
          id,
          sku,
          gtin,
          unitMultiplier,
          name: variantName,
          brand,
          isVariantOf,
          image: productImages,
          additionalProperty,
          offers: {
            offers: [
              {
                price,
                priceWithTaxes,
                listPrice,
                seller,
                quantity,
                listPriceWithTaxes,
              },
            ],
          },
        } = product

        return {
          id,
          price,
          priceWithTaxes,
          listPrice,
          listPriceWithTaxes,
          seller,
          quantity: productIdToBuy === id ? 1 : 0,
          itemOffered: {
            sku,
            name: variantName,
            gtin,
            image: productImages,
            brand,
            isVariantOf,
            additionalProperty,
            unitMultiplier,
          },
        }
      })
      .filter((product) => product.quantity > 0)
  }, [products, productIdToBuy])

  const buyProps = useBuyButton(buyButtonProps)

  React.useEffect(() => {
    if (!productIdToBuy) {
      return
    }

    buyProps.onClick(pendingEvent as React.MouseEvent<HTMLButtonElement>)
  }, [productIdToBuy, pendingEvent])

  useProductsSelected(productIds, isOpen, processResponse)

  return (
    <UIProductComparisonSidebar
      handleProductToBuy={setProductIdToBuy}
      setPendingEvent={setPendingEvent}
      sortOptions={[...sortOptions]}
      {...props}
    />
  )
}

export default ProductComparisonSidebar

export const fragment = gql(`
  fragment ProductComparisonFragment_product on StoreProduct {
    id: productID
    sku
    slug
    name
    gtin
    description
    unitMultiplier
    isVariantOf {
      name
      productGroupID
      skuVariants {
        activeVariations
        slugsMap
        availableVariations
        allVariantProducts {
          name
          productID
        }
      }
    }

    image {
      url
      alternateName
    }

    brand {
      name
    }

    offers {
      lowPrice
      lowPriceWithTaxes
      offers {
        availability
        price
        priceWithTaxes
        listPrice
        quantity
        listPriceWithTaxes
        seller {
          identifier
        }
      }
    }

    additionalProperty {
      propertyID
      name
      value
      valueReference
    }

    advertisement {
      adId
      adResponseId
    }

    hasSpecifications

    skuSpecifications {
      field {
        id
        name
        originalName
      }
      values {
        name
        id
        fieldId
        originalName
      }
    }

    specificationGroups {
      name
      originalName
      specifications {
        name
        originalName
        values
      }
    }
  }
`)
