import { describe, expect, it } from 'vitest'
import { channelWhenSessionDivergesFromOrderForm } from '../../../../../src/platforms/vtex/utils/cartSalesChannel'
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
