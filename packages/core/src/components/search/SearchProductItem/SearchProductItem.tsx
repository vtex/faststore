import {
  Icon,
  SearchProductItem as UISearchProductItem,
  SearchProductItemContent as UISearchProductItemContent,
  SearchProductItemImage as UISearchProductItemImage,
  SKUMatrix as UISKUMatrix,
  SKUMatrixTrigger as UISKUMatrixTrigger,
  useSearch,
  useUI,
} from '@faststore/ui'
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'

import type { ProductSummary_ProductFragment } from '@generated/graphql'
import type { NavbarProps } from 'src/components/sections/Navbar'
import { Image } from 'src/components/ui/Image'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import { sendAutocompleteClickEvent } from '../SearchDropdown'

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
  quickOrderSettings?: NavbarProps['searchInput']['quickOrderSettings']
  /**
   * Method to manage the visibility state of the dropdown when SKU Matrix is active.
   */
  onChangeCustomSearchDropdownVisible?: Dispatch<SetStateAction<boolean>>
}

function SearchProductItem({
  product,
  index,
  quickOrderSettings,
  onChangeCustomSearchDropdownVisible,
  ...otherProps
}: SearchProductItemProps) {
  const {
    values: { term, onSearchSelection },
  } = useSearch()
  const { pushToast } = useUI()

  const { __experimentalSKUMatrixSidebar: UISKUMatrixSidebar } =
    useOverrideComponents<'Navbar'>()

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
        term: term,
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
            title: quickOrderSettings?.invalidQuantityToastLabels?.title,
            message:
              quickOrderSettings?.invalidQuantityToastLabels?.message
                ?.replace('%{min}', min.toString())
                ?.replace('%{max}', max.toString())
                ?.replace('%{quantity}', quantity.toString()) || '',
            status: 'INFO',
            icon: <Icon name="CircleWavyWarning" width={30} height={30} />,
          })
        }
        quickOrder={{
          enabled: quickOrderSettings?.quickOrder,
          outOfStockLabel: 'Out of stock',
          availability: !outOfStock,
          hasVariants,
          buyProps,
          quantity,
          onChangeQuantity: setQuantity,
          max: offersQuantity,
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
                    invalidQuantityToastLabels={
                      quickOrderSettings?.invalidQuantityToastLabels
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
