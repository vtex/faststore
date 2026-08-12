import { describe, expect, it } from 'vitest'
import {
  channelAfterExternalOrderFormSync,
  channelWhenSessionDivergesFromOrderForm,
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

    if (result === null) {
      throw new Error('expected channel string after adopting orderForm SC')
    }

    expect(JSON.parse(result)).toMatchObject({
      salesChannel: '4',
      hasOnlyDefaultSalesChannel: false,
    })
  })
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
})
