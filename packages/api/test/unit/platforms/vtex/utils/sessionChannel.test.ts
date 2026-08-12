import { describe, expect, it } from 'vitest'
import { channelAfterSessionManager } from '../../../../../src/platforms/vtex/utils/sessionChannel'
import type { Channel } from '../../../../../src/platforms/vtex/utils/channel'

const baseChannel = (
  salesChannel: string,
  hasOnlyDefaultSalesChannel = true
): Required<Channel> => ({
  salesChannel,
  regionId: 'r1',
  seller: '',
  hasOnlyDefaultSalesChannel,
})

describe('channelAfterSessionManager', () => {
  it('keeps an explicit client SC when Session Manager reports another', () => {
    expect(
      JSON.parse(
        channelAfterSessionManager(baseChannel('2', false), '1', 'r2', 's1')
      )
    ).toMatchObject({
      salesChannel: '2',
      regionId: 'r2',
      seller: 's1',
      hasOnlyDefaultSalesChannel: false,
    })
  })

  it('prefers Session Manager SC when the client still has the default', () => {
    expect(
      JSON.parse(
        channelAfterSessionManager(baseChannel('1', true), '4', null, undefined)
      )
    ).toMatchObject({
      salesChannel: '4',
      regionId: 'r1',
      hasOnlyDefaultSalesChannel: false,
    })
  })

  it('falls back to the client SC when Session Manager has none', () => {
    expect(
      JSON.parse(
        channelAfterSessionManager(
          baseChannel('1', true),
          null,
          undefined,
          undefined
        )
      )
    ).toMatchObject({
      salesChannel: '1',
      hasOnlyDefaultSalesChannel: true,
    })
  })
})
