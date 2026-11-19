type MockableCartItem = {
  price: number
  priceWithTaxes: number
  priceState?: {
    available: boolean
    reasonKey?: string | null
  } | null
}

export type PriceMockName = 'missing' | 'unavailable' | 'gift' | 'priced'

// Local validation only. In the browser console, then reload:
// localStorage.setItem('fsPriceMock', 'missing')
// localStorage.setItem('fsPriceMock', 'unavailable')
// localStorage.setItem('fsPriceMock', 'gift')
// localStorage.setItem('fsPriceMock', 'priced')
// localStorage.removeItem('fsPriceMock')
export const readPriceMock = (): PriceMockName | null => {
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  if (typeof window === 'undefined') {
    return null
  }

  const value = window.localStorage.getItem('fsPriceMock')

  if (
    value === 'missing' ||
    value === 'unavailable' ||
    value === 'gift' ||
    value === 'priced'
  ) {
    return value
  }

  return null
}

const applyOne = <T extends MockableCartItem>(
  item: T,
  mock: PriceMockName
): T => {
  if (mock === 'missing') {
    const { priceState: _priceState, ...rest } = item

    return rest as T
  }

  if (mock === 'unavailable') {
    return {
      ...item,
      priceState: {
        available: false,
        reasonKey: 'PRICE_REQUIRES_LOGIN',
      },
    }
  }

  if (mock === 'gift') {
    return {
      ...item,
      price: 0,
      priceWithTaxes: 0,
      priceState: { available: true, reasonKey: null },
    }
  }

  return {
    ...item,
    price: item.price > 0 ? item.price : 10,
    priceWithTaxes: item.priceWithTaxes > 0 ? item.priceWithTaxes : 10,
    priceState: { available: true, reasonKey: null },
  }
}

export const applyPriceMock = <T extends MockableCartItem>(
  items: T[],
  mock: PriceMockName | null = readPriceMock()
): T[] => {
  if (!mock) {
    return items
  }

  return items.map((item) => applyOne(item, mock))
}
