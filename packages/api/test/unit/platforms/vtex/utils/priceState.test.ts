import { describe, expect, it } from 'vitest'

import { resolvePriceState } from '../../../../../src/platforms/vtex/utils/priceState'

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

  it('drops a reason that is not a string and ignores a non-object', () => {
    expect(resolvePriceState({ available: false, reasonKey: 1 })).toEqual({
      available: false,
      reasonKey: null,
    })
    expect(resolvePriceState([])).toEqual({
      available: true,
      reasonKey: null,
    })
  })
})
