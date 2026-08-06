import { describe, expect, it } from 'vitest'
import {
  channelAfterExternalOrderFormSync,
  shouldRefetchOrderFormWithSessionSalesChannel,
} from '../../../../../src/platforms/vtex/utils/cartSalesChannel'
import type { Channel } from '../../../../../src/platforms/vtex/utils/channel'

const baseChannel = (salesChannel: string): Required<Channel> => ({
  salesChannel,
  regionId: '',
  seller: '',
  hasOnlyDefaultSalesChannel: true,
})

describe('channelAfterExternalOrderFormSync', () => {
  it('returns null when the orderForm is not stale', () => {
    expect(
      channelAfterExternalOrderFormSync(baseChannel('1'), '4', false)
    ).toBeNull()
  })

  it('returns null when orderForm SC matches session SC', () => {
    expect(
      channelAfterExternalOrderFormSync(baseChannel('4'), '4', true)
    ).toBeNull()
  })

  it('returns null when orderForm SC is missing', () => {
    expect(
      channelAfterExternalOrderFormSync(baseChannel('1'), null, true)
    ).toBeNull()
    expect(
      channelAfterExternalOrderFormSync(baseChannel('1'), '', true)
    ).toBeNull()
  })

  it('adopts orderForm SC when stale and divergent (Quick Order case)', () => {
    const result = channelAfterExternalOrderFormSync(
      baseChannel('1'),
      '4',
      true
    )

    expect(result).not.toBeNull()
    expect(JSON.parse(result as string)).toMatchObject({
      salesChannel: '4',
      hasOnlyDefaultSalesChannel: false,
    })
  })
})

describe('shouldRefetchOrderFormWithSessionSalesChannel', () => {
  it('does not refetch when the orderForm is externally stale', () => {
    expect(shouldRefetchOrderFormWithSessionSalesChannel('1', '4', true)).toBe(
      false
    )
  })

  it('does not refetch when SCs already match', () => {
    expect(shouldRefetchOrderFormWithSessionSalesChannel('1', '1', false)).toBe(
      false
    )
  })

  it('refetches when session SC diverges and cart is not stale (locale switch)', () => {
    expect(shouldRefetchOrderFormWithSessionSalesChannel('2', '1', false)).toBe(
      true
    )
  })

  it('does not refetch when either SC is missing', () => {
    expect(
      shouldRefetchOrderFormWithSessionSalesChannel(undefined, '1', false)
    ).toBe(false)
    expect(
      shouldRefetchOrderFormWithSessionSalesChannel('1', null, false)
    ).toBe(false)
  })
})
