import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import {
  Button,
  Icon,
  SearchProductItem as UISearchProductItem,
  SearchProductItemContent as UISearchProductItemContent,
  SearchProductItemImage as UISearchProductItemImage,
  useSearch,
  useUI,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import useScreenResize from 'src/sdk/ui/useScreenResize'

import styles from 'src/components/sections/Navbar/section.module.scss'

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
  const { pushToast } = useUI()
  const { isDesktop } = useScreenResize()

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
    brand,
    isVariantOf,
    isVariantOf: { name },
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
          quantity: offersQuantity,
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
        mobileVersion={!isDesktop}
        price={{
          value: spotPrice,
          listPrice: listPrice,
          formatter: useFormattedPrice,
        }}
        onValidateBlur={(min, max, quantity) =>
          pushToast({
            title: 'Invalid quantity!',
            message: `The quantity you entered is outside the range of ${min} to ${max}. The quantity was set to ${quantity}.`,
            status: 'INFO',
            icon: <Icon name="CircleWavyWarning" width={30} height={30} />,
          })
        }
        quickOrder={{
          enabled: quickOrder,
          availability: !outOfStock,
          hasVariants,
          buyProps,
          quantity,
          max: offersQuantity,
          onChangeQuantity: setQuantity,
          // FIXME: Use SKU Matrix component
          skuMatrixControl: (
            <Button variant="tertiary">Select Multiples</Button>
          ),
        }}
      ></UISearchProductItemContent>
    </UISearchProductItem>
  )
}

export default SearchProductItem
