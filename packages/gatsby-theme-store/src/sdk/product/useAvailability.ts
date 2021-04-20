import { useMemo } from 'react'

import type { OrderForm } from '../orderForm/Provider'

export type OrderFormData = NonNullable<OrderForm>['items']

export interface Product {
  product: ArrayItem<OrderFormData>
  index: number
}

export type Products = {
  available: Product[]
  unavailable: Product[]
}

export const useAvailability = (products: OrderFormData) =>
  useMemo(() => {
    const result: Products = { available: [], unavailable: [] }

    products.forEach((product: ArrayItem<OrderFormData>, index: number) => {
      if (product.availability === 'available') {
        result.available.push({ product, index })
      } else {
        result.unavailable.push({ product, index })
      }
    })

    return result
  }, [products])
