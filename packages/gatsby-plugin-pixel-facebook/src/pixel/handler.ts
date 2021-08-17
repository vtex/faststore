import type {
  AnalyticsEventHandler,
  ProductOrder,
  ProductViewData,
} from '@vtex/store-sdk'

export const handler: AnalyticsEventHandler = (event) => {
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
        content_ids: items?.map((item: any) => item?.itemId),
        content_name: product?.productName,
        content_type: 'product',
        // TODO: send currency
        value: getProductPrice(event.data),
      })
      break
    }

    case 'vtex:addToCart': {
      const { products } = event.data

      fbq('track', 'AddToCart', {
        value: products.reduce(
          (acc: number, { price }) =>
            acc + (typeof price === 'number' ? price : 0),
          0
        ),
        content_ids: products.map((product) => product.skuId),
        contents: products.map((product) => ({
          id: product.skuId,
          quantity: product.quantity,
          item_price: product.price ? product.price : 0,
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
