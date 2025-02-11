import { useMemo, useState } from 'react'
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
import { sendAutocompleteClickEvent } from '../SearchDropdown'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'

import { NavbarProps } from 'src/components/sections/Navbar'
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
   * Quick Order settings.
   */
  quickOrderSettings: NavbarProps['searchInput']['quickOrderSettings']
}

function SearchProductItem({
  product,
  index,
  quickOrderSettings,
  ...otherProps
}: SearchProductItemProps) {
  const {
    values: { onSearchSelection },
  } = useSearch()
  const { pushToast } = useUI()

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
      sendAutocompleteClickEvent({
        url: href,
        term: name,
        position: index,
        productId: product.isVariantOf.productGroupID ?? product.sku,
      })
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
        onValidateBlur={(min, max, quantity) =>
          pushToast({
            title: 'Invalid quantity!',
            message: `The quantity you entered is outside the range of ${min} to ${max}. The quantity was set to ${quantity}.`,
            status: 'INFO',
            icon: <Icon name="CircleWavyWarning" width={30} height={30} />,
          })
        }
        quickOrder={{
          enabled: quickOrderSettings.quickOrder,
          outOfStockLabel: 'Out of stock',
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
