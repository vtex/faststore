import {
  ProductCard as UIProductCard,
  ProductCardContent as UIProductCardContent,
  ProductCardImage as UIProductCardImage,
} from '@faststore/ui'
import { memo, useMemo } from 'react'

import type { ProductSummary_ProductFragment } from '@generated/graphql'
import { ImageProps } from 'next/future/image'
import NextLink from 'next/link'
import { Image } from 'src/components/ui/Image'
import { usePLP } from 'src/sdk/overrides/PageProvider'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'

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
}

function CustomProductCard({
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
  ...otherProps
}: ProductCardProps) {
  const {
    sku,
    isVariantOf: { name },
    image: [img],
    offers: {
      lowPrice: spotPrice,
      offers: [{ listPrice, availability }],
    },
  } = product

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

  // const context = usePLP()
  // console.log('🚀 ~ CustomProductCard context:', context)

  return (
    <UIProductCard
      outOfStock={outOfStock}
      bordered={bordered}
      variant={variant}
      data-fs-product-card-sku={sku}
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
        showDiscountBadge={showDiscountBadge}
      />
    </UIProductCard>
  )
}

export default memo(CustomProductCard)