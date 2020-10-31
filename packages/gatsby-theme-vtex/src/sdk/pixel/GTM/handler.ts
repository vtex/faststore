import { PixelEvent } from '../pixel'
import { PixelEventHandler } from '../usePixelCallbackEvent'

const getDataFromEvent = (event: PixelEvent) => {
  switch (event.type) {
    case 'vtex:pageView': {
      return {
        event: 'pageView',
        location: event.data.pageUrl,
        page: event.data.pageUrl.replace(window.origin, ''),
        referrer: event.data.referrer,
        ...(event.data.pageTitle && {
          title: event.data.pageTitle,
        }),
      }
    }

    case 'vtex:productView': {
      // TODO: Add SELECTED SKU and category

      if (!event.data.product) {
        return
      }

      const { productName, brand, items } = event.data.product
      const price = items?.[0]?.sellers?.[0]?.commercialOffer?.price

      return {
        ecommerce: {
          detail: {
            products: [
              {
                brand,
                name: productName,
                price,
              },
            ],
          },
        },
        event: 'productDetail',
      }
    }

    case 'vtex:productClick': {
      // TODO: Add brand, categories and sku
      const { productName, items } = event.data.product
      const price = items?.[0]?.sellers?.[0]?.commercialOffer?.price

      return {
        event: 'productClick',
        ecommerce: {
          click: {
            products: [
              {
                name: productName,
                price,
              },
            ],
          },
        },
      }
    }

    case 'vtex:addToCart': {
      // TODO: add currency
      const { items } = event.data

      return {
        ecommerce: {
          add: {
            products: items.map((sku: any) => ({
              brand: sku.brand,
              category: sku.category,
              id: sku.skuId,
              name: sku.name,
              price: `${sku.price}`,
              quantity: sku.quantity,
              variant: sku.variant,
            })),
          },
          // currencyCode: event.data.currency,
        },
        event: 'addToCart',
      }
    }

    case 'vtex:removeFromCart': {
      // TODO: add currency
      const { items } = event.data

      return {
        ecommerce: {
          // currencyCode: event.data.currency,
          remove: {
            products: items.map((sku: any) => ({
              brand: sku.brand,
              id: sku.skuId,
              category: sku.category,
              name: sku.name,
              price: `${sku.price}`,
              quantity: sku.quantity,
              variant: sku.variant,
            })),
          },
        },
        event: 'removeFromCart',
      }
    }

    case 'vtex:orderPlaced': {
      const order = event.data

      return {
        event: 'orderPlaced',
        ...order,
        ecommerce: {
          purchase: {
            actionField: {
              affiliation: order.transactionAffiliation,
              coupon: order.coupon ? order.coupon : null,
              id: order.orderGroup,
              revenue: order.transactionTotal,
              shipping: order.transactionShipping,
              tax: order.transactionTax,
            },
            products: order.transactionProducts.map((product) => ({
              brand: product.brand,
              category: product.categoryTree?.join('/'),
              id: product.sku,
              name: product.name,
              price: product.price,
              quantity: product.quantity,
              variant: product.skuName,
            })),
          },
        },
      }
    }

    case 'vtex:productImpression': {
      // TODO: add currency, brand, itemId, price and skuName
      const { list, impressions } = event.data

      const parsedImpressions = (impressions || []).map(
        ({ product, position }) => ({
          // brand: product.brand,
          // id: product.sku.itemId,
          // price: `${product.sku.seller!.commertialOffer.Price}`,
          // variant: product.sku.name,
          list,
          name: product.productName,
          position,
        })
      )

      return {
        event: 'productImpression',
        ecommerce: {
          // currencyCode: currency,
          impressions: parsedImpressions,
        },
      }
    }

    case 'vtex:userData': {
      const { data } = event

      if (!data.isAuthenticated) {
        return
      }

      return {
        event: 'userData',
        userId: data.id,
      }
    }

    case 'vtex:cartLoaded': {
      const { orderForm } = event.data

      return {
        event: 'checkout',
        ecommerce: {
          checkout: {
            actionField: {
              step: 1,
            },
            products: orderForm.items.map((item) => ({
              id: item.id,
              name: item.name,
              category: Object.keys(item.productCategories ?? {}).reduce(
                (categories, category) =>
                  categories ? `${categories}/${category}` : category,
                ''
              ),
              brand: item.additionalInfo?.brandName ?? '',
              variant: item.skuName,
              price:
                typeof item.sellingPrice === 'number'
                  ? item.sellingPrice / 100
                  : undefined,
              quantity: item.quantity,
            })),
          },
        },
      }
    }

    default:
  }
}

export const handler: PixelEventHandler = (event) => {
  const data = getDataFromEvent(event)

  console.log({ event, data })

  if (data) {
    window.dataLayer.push(data)
  }
}
