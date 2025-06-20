import { useEffect } from 'react'
import type { SKUMatrixSidebarProps as UISKUMatrixSidebarProps } from '@faststore/ui'
import {
  SKUMatrixSidebar as UISKUMatrixSidebar,
  useSKUMatrix,
} from '@faststore/ui'
import { gql } from '@generated/gql'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import { useAllVariantProducts } from 'src/sdk/product/useAllVariantProducts'
import { Image } from '../Image'

interface SKUMatrixProps extends UISKUMatrixSidebarProps {
  product?: ProductSummary_ProductFragment
  status?(data: 'visible' | null): void
}

const ImageComponent: UISKUMatrixSidebarProps['ImageComponent'] = ({
  src,
  alt,
  ...otherProps
}) => <Image src={src} alt={alt} width={48} height={48} {...otherProps} />

function SKUMatrixSidebar(props: SKUMatrixProps) {
  const { data } = usePDP()
  const product = props.product ?? data.product

  const { allVariantProducts, isOpen, setAllVariantProducts } = useSKUMatrix()
  const { isValidating } = useAllVariantProducts(
    product.id,
    isOpen,
    setAllVariantProducts
  )

  useEffect(() => {
    props.status?.(isOpen ? 'visible' : null)
  }, [isOpen])

  const {
    gtin,
    unitMultiplier,
    brand,
    additionalProperty,
    isVariantOf,
    offers: {
      offers: [{ seller }],
    },
  } = product

  const buyButtonProps = allVariantProducts
    .filter((item) => item.selectedCount)
    .map((item) => {
      const {
        offers: {
          offers: [{ price, priceWithTaxes, listPrice, listPriceWithTaxes }],
        },
      } = item

      return {
        id: item.id,
        price,
        priceWithTaxes,
        listPrice,
        listPriceWithTaxes,
        seller,
        quantity: item.selectedCount,
        itemOffered: {
          sku: item.id,
          name: item.name,
          gtin,
          image: [item.image],
          brand,
          isVariantOf: {
            ...isVariantOf,
            skuVariants: {
              ...isVariantOf.skuVariants,
              activeVariations: item.specifications,
            },
          },
          additionalProperty,
          unitMultiplier,
        },
      }
    })

  const buyProps = useBuyButton(buyButtonProps)

  return (
    <UISKUMatrixSidebar
      buyProps={buyProps}
      title={product.isVariantOf.name ?? ''}
      loading={isValidating}
      ImageComponent={ImageComponent}
      {...props}
    />
  )
}

export const fragment = gql(`
  fragment ProductSKUMatrixSidebarFragment_product on StoreProduct {
    id: productID
    isVariantOf {
      name
      productGroupID
      skuVariants {
        activeVariations
        slugsMap
        availableVariations
        allVariantProducts {
					sku
          name
          image {
            url
            alternateName
          }
          offers {
            highPrice
            lowPrice
            lowPriceWithTaxes
            offerCount
            priceCurrency
            offers {
              listPrice
              listPriceWithTaxes
              sellingPrice
              priceCurrency
              price
              priceWithTaxes
              priceValidUntil
              itemCondition
              availability
              quantity
            }
          }
          additionalProperty {
            propertyID
            value
            name
            valueReference
          }
        }
      }
    }
  }
`)

export default SKUMatrixSidebar
