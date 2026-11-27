import { applyPriceMock } from '../../../src/sdk/cart/priceMock'

const item: {
  price: number
  priceWithTaxes: number
  priceState?: { available: boolean; reasonKey: string | null } | null
} = {
  price: 12,
  priceWithTaxes: 14,
  priceState: { available: true, reasonKey: null },
}

describe('price mock', () => {
  it('leaves the item alone when no mock is selected', () => {
    expect(applyPriceMock([item], null)).toEqual([item])
  })

  it('drops priceState for the missing mock', () => {
    expect(applyPriceMock([item], 'missing')[0].priceState).toBeUndefined()
  })

  it('marks the price unavailable', () => {
    expect(applyPriceMock([item], 'unavailable')[0].priceState).toEqual({
      available: false,
      reasonKey: 'PRICE_REQUIRES_LOGIN',
    })
  })

  it('turns the line into an available gift', () => {
    expect(applyPriceMock([item], 'gift')[0]).toMatchObject({
      price: 0,
      priceWithTaxes: 0,
      priceState: { available: true, reasonKey: null },
    })
  })

  it('keeps a positive available price', () => {
    expect(applyPriceMock([item], 'priced')[0]).toMatchObject({
      price: 12,
      priceState: { available: true, reasonKey: null },
    })
  })
})
