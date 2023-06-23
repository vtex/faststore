import type { Dispatch, SetStateAction } from 'react'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

import Selectors from 'src/components/ui/SkuSelector'
import AddToCartLoadingSkeleton from './AddToCartLoadingSkeleton'

import {
  Components,
  Props,
} from 'src/components/sections/ProductDetails/Overrides'

const { BuyButton, Icon, Price, QuantitySelector } = Components

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
  buyButtonIcon: {
    icon: buyButtonIconName = Props['Icon'].name,
    alt: buyButtonIconAlt = Props['Icon']['aria-label'],
  },
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
            formatter={useFormattedPrice}
            testId="list-price"
            variant="listing"
            SRText="Original price:"
            {...Props['Price']}
            value={listPrice}
            data-value={listPrice}
          />
          <Price
            formatter={useFormattedPrice}
            testId="price"
            variant="spot"
            className="text__lead"
            SRText="Sale Price:"
            {...Props['Price']}
            value={lowPrice}
            data-value={lowPrice}
          />
        </div>
        <QuantitySelector
          min={1}
          max={10}
          {...Props['QuantitySelector']}
          // Dynamic props shouldn't be overridable
          // This decision can be reviewed later if needed
          onChange={setQuantity}
        />
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
          <BuyButton
            {...Props['BuyButton']}
            icon={
              <Icon
                {...Props['Icon']}
                aria-label={buyButtonIconAlt}
                name={buyButtonIconName}
              />
            }
            disabled={buyDisabled}
            {...buyProps}
          >
            {buyButtonTitle || 'Add to Cart'}
          </BuyButton>
        )
      }
    </>
  )
}

export default ProductDetailsSettings
