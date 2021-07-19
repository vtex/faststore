import type { OrderProduct } from '@biggy/recsys/event/types/page/confirmation'
import type { PixelEvent, PixelEventHandler } from '@vtex/gatsby-theme-store'

import {
  addToCart,
  cartView,
  categoryClick,
  categoryView,
  orderConfirmation,
  productView,
  removeFromCart,
  searchClick,
  searchQuery,
} from './recsys'
import type { CartItem } from './types'
import { decodeTerm, getTerm } from './utils'

const handleEvent = (event: PixelEvent) => {
  switch (event.type) {
    case 'vtex:internalSiteSearchView': {
      const term = decodeTerm(event.data.term)

      if (event.data.pageType === 'fullText' && term) {
        searchQuery({
          text: term,
          match: event.data.results,
          operator: 'and', // event.data.search.operator ?? 'and'
          misspelled: true, // event.data.search.correction?.misspelled ?? true
          locale: '', // fix
        })
        // checar se é category/departament
      } else if (event.data.pageType === 'plp') {
        categoryView({
          text: term,
          match: event.data.results,
          locale: '', // fix
        })
      }

      break
    }

    case 'vtex:productView': {
      if (!event.data.product) {
        return
      }

      const { id } = event.data.product

      productView({
        productId: id,
        locale: '', // fix
      })
      break
    }

    // case 'vtex:productClick': {
    //   if (!event.data.query) {
    //     return
    //   }

    //   const term = decodeTerm(getTerm(event.data))
    //   const eventData = {
    //     text: term,
    //     product: event.data.product.id,
    //     position: 1, // event.data.position,
    //     locale: '', // fix
    //   }

    //   if (event.data.map === 'ft') {
    //     searchClick(eventData)
    //   } else {
    //     categoryClick(eventData)
    //   }

    //   break
    // }

    case 'vtex:addToCart': {
      if (!event.data.products) {
        return
      }

      const locale = '' // fix

      const items = event.data.products.map((product: CartItem) => {
        return {
          product: product.productId ?? '1', // check
          skuId: product.skuId,
          quantity: product.quantity,
        }
      })

      addToCart(items, locale)
      break
    }

    case 'vtex:removeFromCart': {
      if (!event.data.products) {
        return
      }

      const locale = '' // fix

      const items = event.data.products.map((product: CartItem) => {
        return {
          product: product.productId ?? '1', // check
          skuId: product.skuId,
          quantity: product.quantity,
        }
      })

      removeFromCart(items, locale)
      break
    }

    case 'vtex:orderPlaced': {
      const products: OrderProduct[] = []
      const locale = '' // fix

      for (const product of event.data.transactionProducts) {
        products.push({
          product: product.id, // check
          price: product.sellingPrice, // check
          quantity: product.quantity,
        })
      }

      orderConfirmation(event.data.transactionId, products, locale)
      break
    }

    // case 'vtex:userData': {
    //   const { data } = event

    //   if (!data.isAuthenticated) {
    //     return
    //   }

    //   return {
    //     event: 'userData',
    //     userId: data.id,
    //   }
    // }

    case 'vtex:cartLoaded': {
      const { orderForm } = event.data

      if (!orderForm.items || orderForm.items.length === 0) {
        return
      }

      const locale = '' // fix

      const items = orderForm.items.map(
        (item: {
          id: string
          sku?: string
          quantity: number
          productId?: string | null
        }) => {
          return {
            product: item.productId ?? '1', // check
            skuId: item.id,
            quantity: item.quantity,
          }
        }
      )

      cartView(items, locale)
      break
    }

    default:
  }
}

export const handler: PixelEventHandler = (event: any) => {
  handleEvent(event)
}
