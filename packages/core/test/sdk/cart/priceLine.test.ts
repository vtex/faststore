import {
  formatCartLinePrice,
  isGift,
  lineTotal,
  lineTotalWithTaxes,
  subtotalAmount,
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

  it('adds zero to the tax total when the price is unavailable', () => {
    expect(
      lineTotalWithTaxes({
        price: 12,
        priceWithTaxes: 14,
        quantity: 2,
        priceState: { available: false, reasonKey: 'PRICE_REQUIRES_LOGIN' },
      })
    ).toBe(0)
  })

  it('adds the tax price when the price is available', () => {
    expect(
      lineTotalWithTaxes({
        price: 12,
        priceWithTaxes: 14,
        quantity: 2,
        priceState: { available: true, reasonKey: null },
      })
    ).toBe(28)
  })

  it('keeps the list amount out of the subtotal when the price is unavailable', () => {
    expect(
      subtotalAmount(
        {
          priceState: {
            available: false,
            reasonKey: 'PRICE_REQUIRES_LOGIN',
          },
        },
        20
      )
    ).toBe(0)
  })

  it('keeps the list amount in the subtotal when the price is available', () => {
    expect(
      subtotalAmount({ priceState: { available: true, reasonKey: null } }, 20)
    ).toBe(20)
  })

  it('keeps the list amount in the subtotal when priceState is missing', () => {
    expect(subtotalAmount({}, 20)).toBe(20)
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
    ).toBe('Sign in to see the price')
  })

  it('shows the generic phrase for an unknown reason', () => {
    expect(
      formatCartLinePrice(
        { priceState: { available: false, reasonKey: 'OTHER' } },
        'R$ 10'
      )
    ).toBe('Calculating')
  })

  it('uses the section messages when the cart provides them', () => {
    const messages = {
      login: 'Entre para ver o preço',
      generic: 'calculando',
    }

    expect(
      formatCartLinePrice(
        {
          priceState: {
            available: false,
            reasonKey: 'PRICE_REQUIRES_LOGIN',
          },
        },
        'R$ 0',
        messages
      )
    ).toBe(messages.login)
    expect(
      formatCartLinePrice(
        { priceState: { available: false, reasonKey: null } },
        'R$ 0',
        messages
      )
    ).toBe(messages.generic)
  })

  it('returns a blank message when the list price asks to hide the reason', () => {
    expect(
      formatCartLinePrice(
        {
          priceState: {
            available: false,
            reasonKey: 'PRICE_REQUIRES_LOGIN',
          },
        },
        'R$ 20',
        undefined,
        false
      )
    ).toBe('')
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
