import {
  priceReasonLabel,
  resolvePriceState,
} from '../../../../../src/platforms/vtex/utils/priceState'

describe('resolvePriceState', () => {
  it('returns an available price when the source field is missing', () => {
    expect(resolvePriceState()).toEqual({ available: true, reasonKey: null })
    expect(resolvePriceState(null)).toEqual({
      available: true,
      reasonKey: null,
    })
  })

  it('returns the received key when the price is unavailable', () => {
    expect(
      resolvePriceState({
        available: false,
        reasonKey: 'PRICE_REQUIRES_LOGIN',
      })
    ).toEqual({
      available: false,
      reasonKey: 'PRICE_REQUIRES_LOGIN',
    })
  })
})

describe('priceReasonLabel', () => {
  it('returns the login phrase for PRICE_REQUIRES_LOGIN', () => {
    expect(priceReasonLabel('PRICE_REQUIRES_LOGIN')).toBe(
      'Entre para ver o preço'
    )
  })

  it('returns the generic phrase for any other key', () => {
    expect(priceReasonLabel('UNKNOWN')).toBe('calculando')
    expect(priceReasonLabel(null)).toBe('calculando')
  })
})
