import {
  ProductCard as UIProductCard,
  ProductCardContent as UIProductCardContent,
  ProductCardImage as UIProductCardImage,
  ProductComparisonTrigger as UIProductComparisonTrigger,
} from '@faststore/ui'
import { memo, useMemo } from 'react'

import { gql } from '@generated'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import type { ImageProps } from 'next/image'
import NextLink from 'next/link'
import { Image } from 'src/components/ui/Image'
import { useDeliveryPromise } from 'src/sdk/deliveryPromise'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import { getGlobalSettings } from 'src/utils/globalSettings'

type Variant = 'wide' | 'default'

export interface ProductCardProps {
  product: ProductSummary_ProductFragment
  index: number
  /**
   * Sets a border to the component.
   */
  bordered?: boolean
  /**
   * Sets the component's size.
   */
  variant?: Variant
  /**
   * Specifies the ProductCard image's aspect ratio.
   */
  aspectRatio?: number
  /**
   * Specifies the ProductCard image's props.
   */
  imgProps?: Partial<ImageProps>
  /**
   * Specifies Rating Value of the product.
   */
  ratingValue?: number
  /**
   * Callback function when button is clicked.
   */
  onButtonClick?: () => void
  /**
   * Specifies the button's label.
   */
  buttonLabel?: string
  /**
   * Enables a DiscountBadge to the component.
   */
  showDiscountBadge?: boolean
  /**
   * Define taxes configuration, if taxes should be considered.
   */
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean
    taxesLabel?: string
  }
  /**
   * Specifies the sponsored label, if advertisement is applicable.
   */
  sponsoredLabel?: string
  /**
   * Enable the compare checkbox on display.
   */
  enableCompareCheckbox?: boolean
  /**
   * Label for the compare checkbox.
   */
  compareLabel?: string
}

function ProductCard({
  product,
  index,
  bordered = true,
  variant = 'default',
  aspectRatio = 1,
  imgProps,
  ratingValue,
  buttonLabel = 'Add',
  onButtonClick,
  showDiscountBadge = true,
  taxesConfiguration,
  sponsoredLabel,
  enableCompareCheckbox = false,
  compareLabel,
  ...otherProps
}: ProductCardProps) {
  const {
    sku,
    isVariantOf: { name },
    image: [img],
    advertisement,
    offers: {
      lowPrice,
      lowPriceWithTaxes,
      offers: [{ listPrice: listPriceBase, availability, listPriceWithTaxes }],
    },
    deliveryPromiseBadges,
  } = product

  const { deliveryPromise: deliveryPromiseSettings } = getGlobalSettings() ?? {}
  const { badges, shouldDisplayDeliveryPromiseBadges } = useDeliveryPromise({
    deliveryPromiseBadges,
    deliveryPromiseSettings,
  })

  const linkProps = {
    ...useProductLink({ product, selectedOffer: 0, index }),
    as: NextLink,
    passHref: true,
    legacyBehavior: false,
    prefetch: false,
  }

  const outOfStock = useMemo(
    () => availability !== 'https://schema.org/InStock',
    [availability]
  )

  const spotPrice = taxesConfiguration?.usePriceWithTaxes
    ? lowPriceWithTaxes
    : lowPrice
  const listPrice = taxesConfiguration?.usePriceWithTaxes
    ? listPriceWithTaxes
    : listPriceBase

  const hasDiscount = spotPrice <= listPrice

  const advertisementDataAttributes = advertisement
    ? {
        'data-van-res-id': advertisement.adResponseId,
        'data-van-aid': advertisement.adId,
        'data-van-prod-name': name,
      }
    : {}

  return (
    <>
      {enableCompareCheckbox && (
        <UIProductComparisonTrigger
          label={compareLabel}
          product={product}
          id={product.id}
        />
      )}

      <UIProductCard
        outOfStock={outOfStock}
        bordered={bordered}
        variant={variant}
        data-fs-product-card-sku={sku}
        {...advertisementDataAttributes}
        {...otherProps}
      >
        <UIProductCardImage aspectRatio={aspectRatio}>
          <Image
            src={img.url}
            alt={img.alternateName}
            sizes={`${imgProps?.sizes ?? '(max-width: 768px) 40vw, 30vw'}`}
            width={imgProps?.width ?? 360}
            height={Math.round((Number(imgProps?.height) || 360) / aspectRatio)}
            loading={imgProps?.loading}
          />
        </UIProductCardImage>
        <UIProductCardContent
          title={name}
          price={{
            value: spotPrice,
            listPrice: listPrice,
            formatter: useFormattedPrice,
          }}
          ratingValue={ratingValue}
          outOfStock={outOfStock}
          onButtonClick={onButtonClick}
          linkProps={linkProps}
          showDiscountBadge={hasDiscount && showDiscountBadge}
          includeTaxes={taxesConfiguration?.usePriceWithTaxes}
          includeTaxesLabel={taxesConfiguration?.taxesLabel}
          sponsored={!!advertisement}
          sponsoredLabel={sponsoredLabel}
          deliveryPromiseBadges={shouldDisplayDeliveryPromiseBadges && badges}
        />
      </UIProductCard>
    </>
  )
}

export const fragment = gql(`
  fragment ProductSummary_product on StoreProduct {
    id: productID
    slug
    sku
    brand {
      brandName: name
    }
    name
    gtin
		unitMultiplier

    isVariantOf {
      productGroupID
      name
			skuVariants {
				allVariantsByName
				activeVariations
				slugsMap
				availableVariations
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
        listPrice
        listPriceWithTaxes
        priceWithTaxes
        quantity
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

    hasSpecifications

    unitMultiplier

    isVariantOf {
      productGroupID
      name
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

    advertisement {
      adId
      adResponseId
    }

    deliveryPromiseBadges {
      typeName
    }
  }
`)

export default memo(ProductCard)
