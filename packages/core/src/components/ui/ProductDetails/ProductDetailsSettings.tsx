import type { Dispatch, SetStateAction } from 'react'

import {
  Icon as UIIcon,
  BuyButton as UIBuyButton,
  QuantitySelector as UIQuantitySelector,
} from '@faststore/ui'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

import Selectors from 'src/components/ui/SkuSelector'
import AddToCartLoadingSkeleton from './AddToCartLoadingSkeleton'

import { Components } from '../../sections/ProductDetails/Overrides'
const { Price } = Components

interface ProductDetailsSettingsProps {
  product: ProductDetailsFragment_ProductFragment
  buyButtonTitle: string
  buyButtonIcon: {
    alt: string
    icon: string
  }
  isValidating: boolean
  quantity: number
  setQuantity: Dispatch<SetStateAction<number>>
}

function ProductDetailsSettings({
  product,
  buyButtonTitle,
  isValidating,
  quantity,
  setQuantity,
  buyButtonIcon: { icon: buyButtonIconName, alt: buyButtonIconAlt },
}: ProductDetailsSettingsProps) {
  const {
    id,
    sku,
    gtin,
    name: variantName,
    brand,
    isVariantOf,
    isVariantOf: { skuVariants },
    image: productImages,
    additionalProperty,
    offers: {
      lowPrice,
      offers: [{ availability, price, listPrice, seller }],
    },
  } = product

  const buyDisabled = availability !== 'https://schema.org/InStock'

  const buyProps = useBuyButton({
    id,
    price,
    listPrice,
    seller,
    quantity,
    itemOffered: {
      sku,
      name: variantName,
      gtin,
      image: productImages,
      brand,
      isVariantOf,
      additionalProperty,
    },
  })

  return (
    <>
      <section data-fs-product-details-values>
        <div data-fs-product-details-prices>
          <Price
            value={listPrice}
            formatter={useFormattedPrice}
            testId="list-price"
            data-value={listPrice}
            variant="listing"
            SRText="Original price:"
          />
          <Price
            value={lowPrice}
            formatter={useFormattedPrice}
            testId="price"
            data-value={lowPrice}
            variant="spot"
            className="text__lead"
            SRText="Sale Price:"
          />
        </div>
        <UIQuantitySelector min={1} max={10} onChange={setQuantity} />
      </section>
      {skuVariants && (
        <Selectors
          slugsMap={skuVariants.slugsMap}
          availableVariations={skuVariants.availableVariations}
          activeVariations={skuVariants.activeVariations}
          data-fs-product-details-selectors
        />
      )}
      {
        /* NOTE: A loading skeleton had to be used to avoid a Lighthouse's
                  non-composited animation violation due to the button transitioning its
                  background color when changing from its initial disabled to active state.
                  See full explanation on commit https://git.io/JyXV5. */
        isValidating ? (
          <AddToCartLoadingSkeleton />
        ) : (
          <UIBuyButton
            disabled={buyDisabled}
            icon={
              <UIIcon aria-label={buyButtonIconAlt} name={buyButtonIconName} />
            }
            {...buyProps}
          >
            {buyButtonTitle}
          </UIBuyButton>
        )
      }
    </>
  )
}

export default ProductDetailsSettings
