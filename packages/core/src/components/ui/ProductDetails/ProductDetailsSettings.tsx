import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'

import type { QuantitySelectorRef } from '@faststore/ui'
import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

import Selectors from 'src/components/ui/SkuSelector'
import AddToCartLoadingSkeleton from './AddToCartLoadingSkeleton'

import {
  BuyButton,
  Icon,
  Price,
  QuantitySelector,
  __experimentalNotAvailableButton as NotAvailableButton,
} from 'src/components/sections/ProductDetails/Overrides'

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
  notAvailableButtonTitle: string
}

function ProductDetailsSettings({
  product,
  buyButtonTitle,
  isValidating,
  quantity,
  setQuantity,
  buyButtonIcon: {
    icon: buyButtonIconName = Icon.props.name,
    alt: buyButtonIconAlt = Icon.props['aria-label'],
  },
  notAvailableButtonTitle,
}: ProductDetailsSettingsProps) {
  const router = useRouter()
  const quantitySelectorRef = useRef<QuantitySelectorRef | undefined>(null)

  useEffect(() => {
    function resetQuantitySelector() {
      if (quantitySelectorRef.current) {
        quantitySelectorRef.current.reset()
      }
    }

    // Reset `QuantitySelector` when navigating between PDPs
    router.events.on('routeChangeComplete', resetQuantitySelector)

    return () => {
      router.events.off('routeChangeComplete', resetQuantitySelector)
    }
  }, [router.events])

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

  const outOfStock = useMemo(
    () => availability === 'https://schema.org/OutOfStock',
    [availability]
  )
  const shouldShowDiscountedPrice = useMemo(
    () => lowPrice !== listPrice,
    [lowPrice, listPrice]
  )

  const AddToCartButton = () => {
    return outOfStock ? (
      // TODO: Adds <OutOfStock /> when component is ready to use
      <NotAvailableButton.Component>
        {notAvailableButtonTitle}
      </NotAvailableButton.Component>
    ) : (
      <BuyButton.Component
        {...BuyButton.props}
        icon={
          <Icon.Component
            {...Icon.props}
            name={buyButtonIconName}
            aria-label={buyButtonIconAlt}
          />
        }
        {...buyProps}
      >
        {buyButtonTitle || 'Add to Cart'}
      </BuyButton.Component>
    )
  }

  return (
    <>
      {!outOfStock && (
        <section data-fs-product-details-values>
          <div data-fs-product-details-prices>
            {shouldShowDiscountedPrice ? (
              <>
                <Price.Component
                  formatter={useFormattedPrice}
                  testId="list-price"
                  variant="listing"
                  SRText="Original price:"
                  {...Price.props}
                  // Dynamic props shouldn't be overridable
                  // This decision can be reviewed later if needed
                  value={listPrice}
                  data-value={listPrice}
                />
                <Price.Component
                  formatter={useFormattedPrice}
                  testId="price"
                  variant="spot"
                  className="text__lead"
                  SRText="Sale Price:"
                  {...Price.props}
                  // Dynamic props shouldn't be overridable
                  // This decision can be reviewed later if needed
                  value={lowPrice}
                  data-value={lowPrice}
                />
              </>
            ) : (
              <Price.Component
                formatter={useFormattedPrice}
                testId="list-price"
                variant="spot"
                className="text__lead"
                SRText="Original price:"
                {...Price.props}
                // Dynamic props shouldn't be overridable
                // This decision can be reviewed later if needed
                value={lowPrice}
                data-value={lowPrice}
              />
            )}
          </div>
          <QuantitySelector.Component
            min={1}
            max={10}
            {...QuantitySelector.props}
            // Dynamic props shouldn't be overridable
            // This decision can be reviewed later if needed
            onChange={setQuantity}
            inputRef={quantitySelectorRef}
          />
        </section>
      )}
      {skuVariants && (
        <Selectors
          slugsMap={skuVariants.slugsMap}
          availableVariations={skuVariants.availableVariations}
          activeVariations={skuVariants.activeVariations}
          data-fs-product-details-selectors
        />
      )}
      {isValidating ? (
        /* NOTE:
          A loading skeleton had to be used to avoid a Lighthouse's
          non-composited animation violation due to the button transitioning its
          background color when changing from its initial disabled to active state.
          See full explanation on commit https://git.io/JyXV5. */
        <AddToCartLoadingSkeleton />
      ) : (
        <AddToCartButton />
      )}
    </>
  )
}

export default ProductDetailsSettings
