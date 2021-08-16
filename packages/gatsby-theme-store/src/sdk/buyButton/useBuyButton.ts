import { useGlobalUIState, sendAnalyticsEvent } from '@vtex/store-sdk'

import { useOrderItems } from '../orderForm/useOrderItems'
import { useOrderForm } from '../orderForm/useOrderForm'
import { useBestSeller } from '../product/useBestSeller'
import type { CartPixelProduct } from '../pixel/events'

interface Seller {
  /**
   * Seller id.
   *
   * @type {string}
   * @memberof Seller
   */
  sellerId: string
  /**
   * Seller's commercial offer. It contains price and availability information.
   *
   * @type {object}
   * @memberof Seller
   */
  commercialOffer: {
    /**
     * Available quantity of a seller's SKU.
     *
     * @type {number}
     */
    availableQuantity: number
    /**
     * Price of a seller's SKU.
     *
     * @type {number}
     */
    price: number
  }
}

export interface SKU {
  /**
   * SKU id.
   *
   * @type {string}
   * @memberof SKU
   */
  itemId: string
  /**
   * SKU sellers.
   *
   * @type {Seller[]}
   * @memberof SKU
   */
  sellers: Seller[]
  /**
   * SKU reference id. May be an array of objects with possibly `null` value properties.
   *
   * @type {Maybe<Array<{ value: Maybe<string> }>>}
   * @memberof SKU
   */
  referenceId: Maybe<Array<{ value: Maybe<string> }>>
  /**
   * SKU name. Doesn't include the product name.
   *
   * @type {string}
   * @memberof SKU
   */
  name: string
  /**
   * SKU images. May be an array of objects with possibly `undefined` imageUrl properties.
   *
   * @type {Array<{ imageUrl?: string }>}
   * @memberof SKU
   */
  images?: Array<{
    imageUrl?: string
  }>
}

export interface Product {
  /**
   * Product id.
   *
   * @type {string}
   * @memberof Product
   */
  id: string
  /**
   * Product name. Doesn't include the SKU name.
   *
   * @type {string}
   * @memberof Product
   */
  productName: string
  /**
   * Product brand.
   *
   * @type {string}
   * @memberof Product
   */
  brand: string
  /**
   * Product's category tree. Each category must have a name.
   *
   * @type {Array<{ name: string }>}
   * @memberof Product
   */
  categoryTree: Array<{ name: string }>
  /**
   * Product reference id.
   *
   * @type {Maybe<string>}
   * @memberof Product
   */
  productReference: Maybe<string>
}

export interface Props {
  /**
   * Target SKU for add to cart operations. ´disabled´ is returned as false if `sku` is null or undefined.
   *
   * @type {Maybe<SKU>}
   * @memberof Props
   */
  sku: Maybe<SKU>
  /**
   * Target Product for add to cart operations. Properties are used for optimistic cart behavior and pixel events. ´disabled´ is returned as false if `sku` is null or undefined.
   *
   * @type {Maybe<Product>}
   * @memberof Props
   */
  product: Maybe<Product>
  /**
   * Product quantity to be added to the cart after each click.
   *
   * @type {number}
   * @memberof Props
   */
  quantity: number
  /**
   * Toggle that signals if users should be redirected to the checkout (`true`) or not (`false`) after a click.
   *
   * @type {boolean}
   * @memberof Props
   */
  oneClickBuy?: boolean
  /**
   * Toggle that signals if minicart should be opened (`true`) or not (`false`) after a click.
   *
   * @type {boolean}
   * @memberof Props
   */
  openMinicart?: boolean
}

/**
 * Utility to simplify add to cart operations. Given a product and a SKU, returns common properties to manage the behavior of an add to cart button.
 *
 * @param {Maybe<SKU>} [sku] Target SKU for add to cart operations. ´disabled´ is returned as false if `sku` is null or undefined.
 * @param {Maybe<Product>} [product] Target Product for add to cart operations. Properties are used for optimistic cart behavior and pixel events. ´disabled´ is returned as false if `sku` is null or undefined.
 * @param {number} quantity Product quantity to be added to the cart after each click.
 * @param {boolean} [oneClickBuy=false] Toggle that signals if users should be redirected to the checkout (`true`) or not (`false`) after a click.
 * @param {boolean} [openMinicart=true] Toggle that signals if minicart should be opened (`true`) or not (`false`) after a click.
 * @returns `disabled` and `onClick` properties to be passed on to a button component. `loading` state to be managed by the button.
 */
export const useBuyButton = ({
  sku,
  product,
  quantity,
  oneClickBuy = false,
  openMinicart: shouldOpenMinicart = true,
}: Props) => {
  const { openMinicart } = useGlobalUIState()
  const seller = useBestSeller(sku) as Seller
  const { orderForm, loading } = useOrderForm()
  const { addItems } = useOrderItems()
  const disabled =
    loading ||
    !sku ||
    !orderForm ||
    !seller ||
    !product ||
    seller.commercialOffer.availableQuantity === 0

  // Optimist add item on click
  const onClick = async (e: any) => {
    e.preventDefault()

    if (disabled) {
      return
    }

    const pixelEventProduct = {
      productId: product?.id,
      productReferenceId: product?.productReference,
      productName: product?.productName,
      brand: product?.brand,
      categoryTree: product?.categoryTree,
      price: seller.commercialOffer.price,
      // TODO currencyCode,
      quantity,
      skuId: sku?.itemId,
      skuName: sku?.name,
      skuReferenceId: sku?.referenceId,
    } as CartPixelProduct

    // Item to be updated into the orderForm
    const orderFormItem = {
      id: Number(sku!.itemId),
      quantity,
      seller: seller.sellerId,
    }

    const orderFormItemWithPrice = {
      ...orderFormItem,
      id: sku!.itemId,
      price: seller.commercialOffer.price * 100,
      sellingPrice: seller.commercialOffer.price * 100,
      imageUrl: sku!.images?.[0]?.imageUrl,
      name: product?.productName,
    }

    try {
      const items = [orderFormItemWithPrice]

      const addItemsPromise = addItems(items, {
        allowedOutdatedData: ['paymentData'],
      })

      if (shouldOpenMinicart) {
        openMinicart()
      }

      sendAnalyticsEvent({
        type: 'vtex:addToCart',
        data: {
          products: [pixelEventProduct],
        },
      })

      if (oneClickBuy) {
        // Makes sure the request is completed before redirecting the user
        await addItemsPromise

        requestAnimationFrame(() => {
          window.location.href = '/checkout/'
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    disabled,
    onClick,
    loading,
  }
}
