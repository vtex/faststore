import { describe, expect, it } from 'vitest'

import {
  isCurrentPickupRequest,
  pickupLocationKey,
  shouldRefreshPickupPoints,
} from '../../../src/sdk/deliveryPromise/provider'

describe('shouldRefreshPickupPoints', () => {
  const channel = '{"salesChannel":"1"}'
  const locationKey = pickupLocationKey(channel, 'BRA')

  it('does not fetch without a postal code', () => {
    expect(shouldRefreshPickupPoints(null, true, null, locationKey)).toBe(false)
  })

  it('fetches when the update flag is set', () => {
    expect(shouldRefreshPickupPoints('01310100', true, null, locationKey)).toBe(
      true
    )
  })

  it('does not refetch the same channel and country after the flag is cleared', () => {
    expect(
      shouldRefreshPickupPoints('01310100', false, locationKey, locationKey)
    ).toBe(false)
  })

  it('refetches when the shopper channel changes after the flag is cleared', () => {
    const nextKey = pickupLocationKey('{"salesChannel":"2"}', 'BRA')

    expect(
      shouldRefreshPickupPoints('01310100', false, locationKey, nextKey)
    ).toBe(true)
  })

  it('refetches when the country changes and the channel stays the same', () => {
    const nextKey = pickupLocationKey(channel, 'USA')

    expect(
      shouldRefreshPickupPoints('01310100', false, locationKey, nextKey)
    ).toBe(true)
  })
})

describe('isCurrentPickupRequest', () => {
  it('keeps the response that matches the latest request', () => {
    expect(isCurrentPickupRequest(2, 2)).toBe(true)
  })

  it('drops a response after a newer request has started', () => {
    expect(isCurrentPickupRequest(1, 2)).toBe(false)
  })
})
