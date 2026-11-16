import {
  formatCartLinePrice,
  isGift,
  lineTotal,
} from '../../../src/sdk/cart/priceLine'

describe('cart price line', () => {
  it('keeps a zero price without priceState as a gift', () => {
    expect(isGift({ price: 0 })).toBe(true)
  })

  it('keeps a zero available price as a gift', () => {
    expect(isGift({ price: 0, priceState: { available: true } })).toBe(true)
  })

  it('keeps an unavailable zero price in the item list', () => {
    expect(
      isGift({
        price: 0,
        priceState: { available: false, reasonKey: 'PRICE_REQUIRES_LOGIN' },
      })
    ).toBe(false)
  })

  it('adds zero to the total when the price is unavailable', () => {
    expect(
      lineTotal({
        price: 12,
        quantity: 2,
        priceState: { available: false, reasonKey: 'PRICE_REQUIRES_LOGIN' },
      })
    ).toBe(0)
  })

  it('adds the selling price when the price is available', () => {
    expect(
      lineTotal({
        price: 12,
        quantity: 2,
        priceState: { available: true, reasonKey: null },
      })
    ).toBe(24)
  })

  it('shows the login phrase when the price is unavailable', () => {
    expect(
      formatCartLinePrice(
        {
          priceState: {
            available: false,
            reasonKey: 'PRICE_REQUIRES_LOGIN',
          },
        },
        'R$ 0'
      )
    ).toBe('Entre para ver o preço')
  })

  it('shows the generic phrase for an unknown reason', () => {
    expect(
      formatCartLinePrice(
        { priceState: { available: false, reasonKey: 'OTHER' } },
        'R$ 10'
      )
    ).toBe('calculando')
  })

  it('keeps the formatted price when the price is available', () => {
    expect(
      formatCartLinePrice(
        { priceState: { available: true, reasonKey: null } },
        'R$ 10'
      )
    ).toBe('R$ 10')
  })
})
