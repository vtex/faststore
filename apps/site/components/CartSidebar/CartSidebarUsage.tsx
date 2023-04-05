/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
  Button,
  CartSidebar,
  CartSidebarList,
  CartSidebarFooter,
  CartItem,
  CartItemImage,
  CartItemSummary,
  Icon,
  Gift,
  GiftContent,
  GiftImage,
  OrderSummary,
  useUI,
} from '@faststore/ui'

import { product } from 'site/mocks/product'
import { useFormattedPrice } from '../utilities/usePriceFormatter'

export const skuActiveVariants =
  product.isVariantOf.skuVariants.activeVariations
export const activeVariations = Object.keys(skuActiveVariants).map((key) => ({
  label: key,
  option: skuActiveVariants[key],
}))

export const CartSidebarUsage = () => {
  const { cart: displayCart, openCart, closeCart } = useUI()
  return (
    <>
      <Button
        variant="tertiary"
        iconPosition="left"
        aria-label="Open Filters"
        onClick={openCart}
      >
        Open Cart
      </Button>
      {displayCart && (
        <CartSidebar
          totalItems={0}
          alertIcon={<Icon name="Truck" />}
          alertText="Free shipping starts at $300"
          onClose={closeCart}
        >
          <CartSidebarList>
            <CartItem
              price={{
                value: product.offers.offers[0].price,
                listPrice: product.offers.offers[0].listPrice,
                formatter: useFormattedPrice,
              }}
              quantity={3}
            >
              <CartItemImage>
                <img
                  data-fs-image
                  src={product.image[0].url}
                  alt={product.image[0].alternateName}
                />
              </CartItemImage>
              <CartItemSummary
                title={product.isVariantOf.name}
                activeVariations={activeVariations}
              />
            </CartItem>
            <Gift icon={<Icon name="Tag" />}>
              <GiftImage>
                <img
                  src="https://storeframework.vtexassets.com/arquivos/ids/190902/unsplash-magic-mouse.jpg?v=637800136963870000"
                  alt="Magicwhite"
                  width={89}
                  height={89}
                />
              </GiftImage>
              <GiftContent
                productName="Apple Magic Mouse"
                price={{
                  value: 999,
                  listPrice: 999,
                  formatter: useFormattedPrice,
                }}
              />
            </Gift>
          </CartSidebarList>
          <CartSidebarFooter>
            <OrderSummary
              subtotalLabel="Subtotal (3 products)"
              subtotalValue="$1,200"
              discountValue="-$100"
              totalValue="$1,100"
            />
            <Button
              data-fs-cart-sidebar-checkout-button
              variant="primary"
              icon={<Icon name="ArrowRight" width={18} height={18} />}
              iconPosition="right"
            >
              Checkout
            </Button>
          </CartSidebarFooter>
        </CartSidebar>
      )}
    </>
  )
}

export default CartSidebarUsage
