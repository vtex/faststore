import { describe, expect, it } from 'vitest'
import {
  channelWhenSessionDivergesFromOrderForm,
  shouldTrustOrderFormSalesChannel,
} from '../../../../../src/platforms/vtex/utils/cartSalesChannel'
import type { Channel } from '../../../../../src/platforms/vtex/utils/channel'

const baseChannel = (salesChannel: string): Required<Channel> => ({
  salesChannel,
  regionId: '',
  seller: '',
  hasOnlyDefaultSalesChannel: true,
})

describe('channelWhenSessionDivergesFromOrderForm', () => {
  it('adopts orderForm SC when session lags behind the cart', () => {
    const result = channelWhenSessionDivergesFromOrderForm(
      baseChannel('1'),
      '2'
    )

    if (result === null) {
      throw new Error('expected channel adoption when session diverges')
    }

    expect(JSON.parse(result)).toMatchObject({
      salesChannel: '2',
      hasOnlyDefaultSalesChannel: false,
    })
  })

  it('returns null when SCs already match', () => {
    expect(
      channelWhenSessionDivergesFromOrderForm(baseChannel('2'), '2')
    ).toBeNull()
  })

  it('returns null when orderForm SC is missing', () => {
    expect(
      channelWhenSessionDivergesFromOrderForm(baseChannel('1'), null)
    ).toBeNull()
    expect(
      channelWhenSessionDivergesFromOrderForm(baseChannel('1'), '')
    ).toBeNull()
  })
})

describe('shouldTrustOrderFormSalesChannel', () => {
  const item = { id: '1' } as never

  it('trusts the orderForm SC when the orderForm has items', () => {
    expect(
      shouldTrustOrderFormSalesChannel(
        { items: [item], salesChannel: '4' },
        '2'
      )
    ).toBe(true)
  })

  it('trusts an empty orderForm only when its SC matches the session', () => {
    expect(
      shouldTrustOrderFormSalesChannel({ items: [], salesChannel: '4' }, '4')
    ).toBe(true)
  })

  it('does not trust an empty orderForm that fell back to another SC', () => {
    expect(
      shouldTrustOrderFormSalesChannel({ items: [], salesChannel: '1' }, '4')
    ).toBe(false)
  })

  it('does not trust an empty orderForm without SC', () => {
    expect(
      shouldTrustOrderFormSalesChannel({ items: [], salesChannel: '' }, '4')
    ).toBe(false)
    expect(
      shouldTrustOrderFormSalesChannel(
        { items: [], salesChannel: null as never },
        '4'
      )
    ).toBe(false)
  })

  it('compares SCs as strings', () => {
    expect(
      shouldTrustOrderFormSalesChannel(
        { items: [], salesChannel: '4' },
        4 as never
      )
    ).toBe(true)
  })
})
