import type { MouseEventHandler } from 'react'

import ProductCard, {
  type ProductCardProps,
} from 'src/components/product/ProductCard'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'

export interface CartRecommendationProductCardProps extends ProductCardProps {}

/**
 * Product card used by the cart drawer recommendation shelf. Same surface as
 * the page shelf card, plus an add-to-cart action that appends the recommended
 * SKU without reopening the drawer (`shouldOpenCart: false`).
 *
 * Adds the first offer returned by the recommendations API (the card already
 * represents a specific `StoreProduct` / SKU). Multi-SKU matrix selection is
 * out of scope here — shoppers who need another variant can open the PDP.
 */
function CartRecommendationProductCard({
  product,
  buttonLabel = 'Add to cart',
  onButtonClick,
  ...otherProps
}: Readonly<CartRecommendationProductCardProps>) {
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
      offers: [
        {
          listPrice,
          price,
          listPriceWithTaxes,
          seller,
          priceWithTaxes,
          priceToken,
        },
      ],
    },
    additionalProperty,
  } = product

  const buyProps = useBuyButton(
    {
      id,
      price,
      priceWithTaxes,
      listPrice,
      listPriceWithTaxes,
      seller,
      quantity: 1,
      priceToken,
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

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    buyProps.onClick(event)
    onButtonClick?.(event)
  }

  return (
    <ProductCard
      {...otherProps}
      product={product}
      buttonLabel={buttonLabel}
      onButtonClick={handleClick}
    />
  )
}

export default CartRecommendationProductCard
