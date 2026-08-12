import { describe, expect, it, vi } from 'vitest'
import type { Session } from '@faststore/sdk'
import { syncSalesChannelFromOrderForm } from '../../../src/sdk/session/syncSalesChannelFromOrderForm'

const baseSession = (
  salesChannel: string,
  explicit = true,
  channelOverride?: string | null
): Session => ({
  currency: { code: 'BRL', symbol: 'R$' },
  locale: 'pt-BR',
  country: 'BRA',
  channel:
    channelOverride !== undefined
      ? channelOverride
      : JSON.stringify({
          salesChannel,
          regionId: '',
          hasOnlyDefaultSalesChannel: !explicit,
        }),
  deliveryMode: null,
  addressType: null,
  city: null,
  postalCode: null,
  geoCoordinates: null,
  person: null,
  b2b: null,
  marketingData: null,
  refreshAfter: null,
})

describe('syncSalesChannelFromOrderForm', () => {
  it('updates session channel silently when SC diverges', () => {
    const setSilent = vi.fn()
    const synced = syncSalesChannelFromOrderForm(
      '2',
      () => baseSession('1', false),
      setSilent
    )

    expect(synced).toBe(true)
    expect(setSilent).toHaveBeenCalledTimes(1)
    const next = setSilent.mock.calls[0][0] as Session
    expect(JSON.parse(next.channel ?? '{}')).toMatchObject({
      salesChannel: '2',
      hasOnlyDefaultSalesChannel: false,
    })
  })

  it('is a no-op when SC already matches', () => {
    const setSilent = vi.fn()
    const synced = syncSalesChannelFromOrderForm(
      '2',
      () => baseSession('2'),
      setSilent
    )

    expect(synced).toBe(false)
    expect(setSilent).not.toHaveBeenCalled()
  })

  it('is a no-op when adopted SC is missing', () => {
    const setSilent = vi.fn()
    expect(
      syncSalesChannelFromOrderForm(null, () => baseSession('1'), setSilent)
    ).toBe(false)
    expect(
      syncSalesChannelFromOrderForm('', () => baseSession('1'), setSilent)
    ).toBe(false)
    expect(setSilent).not.toHaveBeenCalled()
  })

  it('resets non-object channel JSON before adopting SC', () => {
    const setSilent = vi.fn()

    for (const invalid of ['null', '[]', '"text"', '0', 'false']) {
      setSilent.mockClear()
      const synced = syncSalesChannelFromOrderForm(
        '2',
        () => baseSession('1', true, invalid),
        setSilent
      )

      expect(synced).toBe(true)
      expect(JSON.parse(setSilent.mock.calls[0][0].channel)).toMatchObject({
        salesChannel: '2',
        hasOnlyDefaultSalesChannel: false,
      })
    }
  })

  it('resets malformed channel JSON before adopting SC', () => {
    const setSilent = vi.fn()
    const synced = syncSalesChannelFromOrderForm(
      '2',
      () => baseSession('1', true, '{'),
      setSilent
    )

    expect(synced).toBe(true)
    expect(JSON.parse(setSilent.mock.calls[0][0].channel)).toMatchObject({
      salesChannel: '2',
      hasOnlyDefaultSalesChannel: false,
    })
  })

  it('ignores object-valued salesChannel when comparing', () => {
    const setSilent = vi.fn()
    const synced = syncSalesChannelFromOrderForm(
      '2',
      () =>
        baseSession(
          '1',
          true,
          JSON.stringify({ salesChannel: { nested: true } })
        ),
      setSilent
    )

    expect(synced).toBe(true)
    expect(JSON.parse(setSilent.mock.calls[0][0].channel).salesChannel).toBe(
      '2'
    )
  })
})
