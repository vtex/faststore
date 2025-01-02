import type {
  IProductComparison,
  ProductComparisonSidebarProps as UIProductComparisonSidebarProps,
} from '@faststore/ui'

import {
  ProductComparisonSidebar as UIProductComparisonSidebar,
  useProductComparison,
} from '@faststore/ui'
import { gql } from '@generated/gql'
import { ClientManyProductsSelectedQueryQuery } from '@generated/graphql'
import { useProductsSelected } from 'src/sdk/product/useProductsSelected'

interface ProductComparisonSidebarProps
  extends UIProductComparisonSidebarProps {}

function ProductComparisonSidebar(props: ProductComparisonSidebarProps) {
  const { productIds, isOpen, handleProductsComparison } =
    useProductComparison()

  function processResponse(data: ClientManyProductsSelectedQueryQuery) {
    const skuSpecifications = data.products.reduce((acc, product) => {
      const productSpecifications = product.skuSpecifications.map((spec) => ({
        field: spec.field.name,
        values: spec.values.map((value) => value.name),
      }))

      return [...acc, ...productSpecifications]
    }, [])

    const formattedData: IProductComparison[] = data.products.map((product) => {
      return {
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        gtin: product.gtin,
        id: product.id,
        brand: { name: product.brand.name, brandName: product.brand.name },
        isVariantOf: {
          productGroupID: product.isVariantOf.productGroupID,
          name: product.isVariantOf.name,
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

  useProductsSelected(productIds, isOpen, processResponse)

  return <UIProductComparisonSidebar {...props} />
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
import type {
  IProductComparison,
  ProductComparisonSidebarProps as UIProductComparisonSidebarProps,
} from '@faststore/ui'

import {
  ProductComparisonSidebar as UIProductComparisonSidebar,
  useProductComparison,
} from '@faststore/ui'
import { gql } from '@generated/gql'
import { ClientManyProductsSelectedQueryQuery } from '@generated/graphql'
import { useProductsSelected } from 'src/sdk/product/useProductsSelected'

interface ProductComparisonSidebarProps
  extends UIProductComparisonSidebarProps {}

function ProductComparisonSidebar(props: ProductComparisonSidebarProps) {
  const { productIds, isOpen, handleProductsComparison } =
    useProductComparison()

  function processResponse(data: ClientManyProductsSelectedQueryQuery) {
    const skuSpecifications = data.products.reduce((acc, product) => {
      const productSpecifications = product.skuSpecifications.map((spec) => ({
        field: spec.field.name,
        values: spec.values.map((value) => value.name),
      }))

      return [...acc, ...productSpecifications]
    }, [])

    const formattedData: IProductComparison[] = data.products.map((product) => {
      return {
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        gtin: product.gtin,
        id: product.id,
        brand: { name: product.brand.name, brandName: product.brand.name },
        isVariantOf: {
          productGroupID: product.isVariantOf.productGroupID,
          name: product.isVariantOf.name,
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

    console.log(formattedData)
    handleProductsComparison(formattedData)
  }

  useProductsSelected(productIds, isOpen, processResponse)

  return <UIProductComparisonSidebar {...props} />
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
