import type { PixelEventHandler } from '@vtex/gatsby-theme-store/src/sdk/pixel/usePixelEvent'
import type {
  ProductOrder,
  ProductViewData,
} from '@vtex/gatsby-theme-store/src/sdk/pixel/events'

export const handler: PixelEventHandler = (event) => {
  switch (event.type) {
    case 'vtex:pageView': {
      break
    }

    case 'vtex:orderPlaced': {
      const { currency, transactionTotal, transactionProducts } = event.data

      fbq('track', 'Purchase', {
        value: transactionTotal,
        currency,
        content_type: 'product',
        contents: transactionProducts.map((product: ProductOrder) => ({
          id: product.sku,
          quantity: product.quantity,
          item_price: product.sellingPrice,
        })),
      })
      break
    }

    case 'vtex:productView': {
      const { product } = event.data
      const items = product?.items

      fbq('track', 'ViewContent', {
        content_ids: items?.map((item) => item?.itemId),
        content_name: product?.productName,
        content_type: 'product',
        // TODO: send currency
        value: getProductPrice(event.data),
      })
      break
    }

    case 'vtex:addToCart': {
      const { items } = event.data

      fbq('track', 'AddToCart', {
        value:
          items.reduce((acc, item) => acc + (item.price ? item.price : 0), 0) /
          100,
        content_ids: items.map((sku) => sku.id),
        contents: items.map((sku) => ({
          id: sku.id,
          quantity: sku.quantity,
          item_price: (sku.price ? sku.price : 0) / 100,
        })),
        content_type: 'product',
        // TODO: send currency
      })
      break
    }

    default:
      break
  }
}

function getProductPrice(productView: ProductViewData) {
  let price

  try {
    price =
      productView.product?.items?.[0]?.sellers?.[0]?.commercialOffer?.price
  } catch {
    price = undefined
  }

  return price
}
