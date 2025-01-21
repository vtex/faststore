import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import {
  SearchProductItem as UISearchProductItem,
  SearchProductItemContent as UISearchProductItemContent,
  SearchProductItemImage as UISearchProductItemImage,
  SKUMatrix as UISKUMatrix,
  SKUMatrixTrigger as UISKUMatrixTrigger,
  useSearch,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import { sendAutocompleteClickEvent } from '../SearchDropdown'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { NavbarProps } from 'src/components/sections/Navbar'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
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
   * Quick Order settings.
   */
  quickOrderSettings: NavbarProps['searchInput']['quickOrderSettings']
  onChangeCustomSearchDropdownVisible: Dispatch<SetStateAction<boolean>>
}

function SearchProductItem({
  product,
  index,
  quickOrderSettings,
  onChangeCustomSearchDropdownVisible,
  ...otherProps
}: SearchProductItemProps) {
  const {
    values: { onSearchSelection },
  } = useSearch()

  const { _experimentalSKUMatrixSidebar: UISKUMatrixSidebar } =
    useOverrideComponents<'Navbar'>()

  const { href, onClick, ...baseLinkProps } = useProductLink({
    product,
    selectedOffer: 0,
    index,
  })

  const {
    isVariantOf: { name },
    image: [img],
    offers: {
      lowPrice: spotPrice,
      offers: [{ listPrice }],
    },
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
          enabled: quickOrderSettings?.quickOrder,
          availability: !outOfStock,
          hasVariants,
          buyProps,
          quantity,
          onChangeQuantity: setQuantity,
          skuMatrixControl: (
            <>
              {quickOrderSettings?.quickOrder && (
                <UISKUMatrix>
                  <UISKUMatrixTrigger>
                    {quickOrderSettings?.skuMatrix.triggerButtonLabel}
                  </UISKUMatrixTrigger>

                  <UISKUMatrixSidebar.Component
                    overlayProps={{ className: styles.section }}
                    formatter={useFormattedPrice}
                    columns={quickOrderSettings?.skuMatrix.columns}
                    product={product}
                    status={(status: string | null) =>
                      onChangeCustomSearchDropdownVisible(status === 'visible')
                    }
                  />
                </UISKUMatrix>
              )}
            </>
          ),
        }}
      ></UISearchProductItemContent>
    </UISearchProductItem>
  )
}

export default SearchProductItem
