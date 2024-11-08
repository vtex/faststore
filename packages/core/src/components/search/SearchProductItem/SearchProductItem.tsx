import {
  SearchProductItem as UISearchProductItem,
  SearchProductItemContent as UISearchProductItemContent,
  SearchProductItemImage as UISearchProductItemImage,
  useSearch,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import { useMemo, useState } from 'react'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'

type SearchProductItemProps = {
  /**
   * Product to be showed in `SearchProductItem`.
   */
  product: ProductSummary_ProductFragment
  /**
   * Index to generate product link.
   */
  index: number
  /**
   * Enable Quick Order.
   */
  quickOrder?: boolean
}

function SearchProductItem({
  product,
  index,
  quickOrder,
  ...otherProps
}: SearchProductItemProps) {
  const {
    values: { onSearchSelection },
  } = useSearch()

  const { href, onClick, ...baseLinkProps } = useProductLink({
    product,
    selectedOffer: 0,
    index,
  })

  const [quantity, setQuantity] = useState<number>(1)

  const {
    id,
    sku,
    gtin,
    name,
    brand,
    isVariantOf,
    unitMultiplier,
    image: [img],
    offers: {
      lowPrice: spotPrice,
      offers: [
        {
          listPrice,
          availability,
          price,
          listPriceWithTaxes,
          seller,
          priceWithTaxes,
        },
      ],
    },
    additionalProperty,
  } = product

  const linkProps = {
    href,
    onClick: () => {
      onClick()
      onSearchSelection?.(name, href)
    },
    ...baseLinkProps,
  }

  const outOfStock = useMemo(
    () => availability === 'https://schema.org/OutOfStock',
    [availability]
  )

  const hasVariants = useMemo(
    () =>
      Boolean(
        Object.keys(product.isVariantOf.skuVariants.allVariantsByName).length
      ),

    [product]
  )

  const buyProps = useBuyButton(
    {
      id,
      price,
      priceWithTaxes,
      listPrice,
      listPriceWithTaxes,
      seller,
      quantity,
      itemOffered: {
        sku,
        name,
        gtin,
        image: [img],
        brand,
        isVariantOf,
        additionalProperty,
        unitMultiplier,
      },
    },
    false
  )

  return (
    <UISearchProductItem linkProps={linkProps} {...otherProps}>
      <UISearchProductItemImage>
        <Image src={img.url} alt={img.alternateName} width={56} height={56} />
      </UISearchProductItemImage>
      <UISearchProductItemContent
        title={name}
        price={{
          value: spotPrice,
          listPrice: listPrice,
          formatter: useFormattedPrice,
        }}
        quickOrder={{
          enabled: quickOrder,
          availability: !outOfStock,
          hasVariants,
          buyProps,
          quantity,
          onChangeQuantity: setQuantity,
          // FIXME: Use SKU Matrix component
          skuMatrixControl: <button>Select multiple</button>,
        }}
      ></UISearchProductItemContent>
    </UISearchProductItem>
  )
}

export default SearchProductItem
