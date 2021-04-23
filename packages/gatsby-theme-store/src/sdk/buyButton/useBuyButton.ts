import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import { useOrderItems } from '../orderForm/useOrderItems'
import { useOrderForm } from '../orderForm/useOrderForm'
import { useBestSeller } from '../product/useBestSeller'
import { usePixelEvent } from '../pixel/usePixelEvent'
import { useMinicart } from '../minicart/useMinicart'

interface Seller {
  sellerId: string
  commercialOffer: {
    availableQuantity: number
    price: number
  }
}

export interface SKU {
  itemId: string
  sellers: Seller[]
  images?: Array<{
    imageUrl: string
  }>
}

export interface Props {
  sku: Maybe<SKU>
  quantity: number
  oneClickBuy?: boolean
  openMinicart?: boolean
  productName?: string
}

export const useBuyButton = ({
  sku,
  quantity,
  oneClickBuy = false,
  openMinicart = true,
  productName,
}: Props) => {
  const minicart = useMinicart()
  const seller = useBestSeller(sku)
  const { orderForm, loading } = useOrderForm()
  const { addItems } = useOrderItems()
  const disabled =
    loading ||
    !sku ||
    !orderForm ||
    !seller ||
    seller.commercialOffer.availableQuantity === 0

  // Redirects the user to checkout after reassuring the pixel event was received
  usePixelEvent((e) => {
    if (e.type !== 'vtex:addToCart') {
      return
    }

    const isThisItem = e.data.items[0].id?.toString() === sku?.itemId

    if (!isThisItem || !e.data.oneClickBuy) {
      return
    }

    requestAnimationFrame(() => {
      window.location.href = '/checkout/'
    })
  })

  // Optimist add item on click
  const onClick = async (e: any) => {
    e.preventDefault()

    if (disabled) {
      return
    }

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
      name: productName,
    }

    try {
      const items = [orderFormItemWithPrice]

      addItems(items, { allowedOutdatedData: ['paymentData'] })

      if (openMinicart) {
        minicart.toggle()
      }

      sendPixelEvent({
        type: 'vtex:addToCart',
        data: {
          items: [orderFormItem],
          oneClickBuy,
        },
      })
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
