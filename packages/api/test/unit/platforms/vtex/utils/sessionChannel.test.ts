import { describe, expect, it } from 'vitest'
import {
  channelAfterSessionManager,
  rejectedSalesChannelOf,
  salesChannelSourceOf,
} from '../../../../../src/platforms/vtex/utils/sessionChannel'
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
  it('keeps an orderForm-adopted SC and re-emits the marker', () => {
    expect(
      JSON.parse(
        channelAfterSessionManager(
          baseChannel('2', false),
          '1',
          'r2',
          's1',
          'orderForm'
        )
      )
    ).toEqual({
      salesChannel: '2',
      regionId: 'r2',
      seller: 's1',
      hasOnlyDefaultSalesChannel: false,
      salesChannelSource: 'orderForm',
    })
  })

  it('keeps a URL-derived SC and re-emits the marker', () => {
    expect(
      JSON.parse(
        channelAfterSessionManager(
          baseChannel('3'),
          '1',
          null,
          undefined,
          'url'
        )
      )
    ).toMatchObject({
      salesChannel: '3',
      hasOnlyDefaultSalesChannel: false,
      salesChannelSource: 'url',
    })
  })

  it('follows Session Manager for a legacy pinned channel without marker', () => {
    const result = JSON.parse(
      channelAfterSessionManager(baseChannel('1', false), '4', null, undefined)
    )

    expect(result).toMatchObject({
      salesChannel: '4',
      hasOnlyDefaultSalesChannel: false,
    })
    expect(result).not.toHaveProperty('salesChannelSource')
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
          baseChannel('1', false),
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

describe('channelAfterSessionManager rejected sales channel', () => {
  it('re-emits a recorded rejection', () => {
    expect(
      JSON.parse(
        channelAfterSessionManager(
          baseChannel('4', false),
          '4',
          null,
          undefined,
          undefined,
          '6'
        )
      )
    ).toMatchObject({ salesChannel: '4', rejectedSalesChannel: '6' })
  })

  it('drops the rejection once Session Manager resolves that SC', () => {
    expect(
      JSON.parse(
        channelAfterSessionManager(
          baseChannel('4', false),
          '6',
          null,
          undefined,
          undefined,
          '6'
        )
      )
    ).not.toHaveProperty('rejectedSalesChannel')
  })
})

describe('rejectedSalesChannelOf', () => {
  it('reads the rejected SC from the raw channel string', () => {
    expect(
      rejectedSalesChannelOf('{"salesChannel":"4","rejectedSalesChannel":"6"}')
    ).toBe('6')
    expect(
      rejectedSalesChannelOf('{"salesChannel":"4","rejectedSalesChannel":6}')
    ).toBe('6')
  })

  it('ignores missing or malformed values', () => {
    expect(rejectedSalesChannelOf('{"salesChannel":"4"}')).toBeUndefined()
    expect(
      rejectedSalesChannelOf('{"rejectedSalesChannel":""}')
    ).toBeUndefined()
    expect(rejectedSalesChannelOf('not json')).toBeUndefined()
    expect(rejectedSalesChannelOf(null)).toBeUndefined()
  })
})

describe('salesChannelSourceOf', () => {
  it('reads the known markers from the raw channel string', () => {
    expect(
      salesChannelSourceOf(
        '{"salesChannel":"4","salesChannelSource":"orderForm"}'
      )
    ).toBe('orderForm')
    expect(
      salesChannelSourceOf('{"salesChannel":"4","salesChannelSource":"url"}')
    ).toBe('url')
  })

  it('ignores missing, unknown or malformed markers', () => {
    expect(salesChannelSourceOf('{"salesChannel":"4"}')).toBeUndefined()
    expect(
      salesChannelSourceOf('{"salesChannel":"4","salesChannelSource":"x"}')
    ).toBeUndefined()
    expect(salesChannelSourceOf('not json')).toBeUndefined()
    expect(salesChannelSourceOf(null)).toBeUndefined()
    expect(salesChannelSourceOf('null')).toBeUndefined()
  })
})
