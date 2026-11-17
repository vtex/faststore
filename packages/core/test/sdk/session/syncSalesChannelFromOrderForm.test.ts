import { describe, expect, it, vi } from 'vitest'
import type { Session } from '@faststore/sdk'
import {
  releaseAdoptedSalesChannel,
  syncSalesChannelFromOrderForm,
  syncSessionWithValidatedCart,
} from '../../../src/sdk/session/syncSalesChannelFromOrderForm'

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
      salesChannelSource: 'orderForm',
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

describe('releaseAdoptedSalesChannel', () => {
  const withChannel = (channel: Record<string, unknown>) =>
    baseSession('', true, JSON.stringify(channel))

  it('drops the orderForm marker and keeps the rest of the channel', () => {
    const setSilent = vi.fn()
    const released = releaseAdoptedSalesChannel(
      () =>
        withChannel({
          salesChannel: '4',
          regionId: 'r1',
          hasOnlyDefaultSalesChannel: false,
          salesChannelSource: 'orderForm',
        }),
      setSilent
    )

    expect(released).toBe(true)
    expect(JSON.parse(setSilent.mock.calls[0][0].channel)).toEqual({
      salesChannel: '4',
      regionId: 'r1',
      hasOnlyDefaultSalesChannel: false,
    })
  })

  it('drops a rejected SC together with the adoption marker', () => {
    const setSilent = vi.fn()

    releaseAdoptedSalesChannel(
      () =>
        withChannel({
          salesChannel: '4',
          salesChannelSource: 'orderForm',
          rejectedSalesChannel: '6',
        }),
      setSilent
    )

    expect(JSON.parse(setSilent.mock.calls[0][0].channel)).toEqual({
      salesChannel: '4',
    })
  })

  it('drops a rejected SC left after the adoption was dropped', () => {
    const setSilent = vi.fn()

    expect(
      releaseAdoptedSalesChannel(
        () => withChannel({ salesChannel: '4', rejectedSalesChannel: '6' }),
        setSilent
      )
    ).toBe(true)
    expect(JSON.parse(setSilent.mock.calls[0][0].channel)).toEqual({
      salesChannel: '4',
    })
  })

  it('keeps the URL marker when dropping a rejected SC', () => {
    const setSilent = vi.fn()

    releaseAdoptedSalesChannel(
      () =>
        withChannel({
          salesChannel: '3',
          salesChannelSource: 'url',
          rejectedSalesChannel: '6',
        }),
      setSilent
    )

    expect(JSON.parse(setSilent.mock.calls[0][0].channel)).toEqual({
      salesChannel: '3',
      salesChannelSource: 'url',
    })
  })

  it('is a no-op without the orderForm marker', () => {
    const setSilent = vi.fn()

    expect(
      releaseAdoptedSalesChannel(
        () => withChannel({ salesChannel: '4' }),
        setSilent
      )
    ).toBe(false)
    expect(
      releaseAdoptedSalesChannel(
        () => withChannel({ salesChannel: '3', salesChannelSource: 'url' }),
        setSilent
      )
    ).toBe(false)
    expect(
      releaseAdoptedSalesChannel(() => baseSession('', true, '{'), setSilent)
    ).toBe(false)
    expect(setSilent).not.toHaveBeenCalled()
  })
})

describe('syncSessionWithValidatedCart', () => {
  const store = (channel: Record<string, unknown>) => {
    let session = baseSession('', true, JSON.stringify(channel))
    const setSilent = vi.fn((next: Session) => {
      session = next
    })

    return {
      read: () => session,
      setSilent,
      channel: () => JSON.parse(session.channel ?? '{}'),
    }
  }

  it('adopts the returned SC and keeps the marker while the cart has items', () => {
    const s = store({ salesChannel: '2' })

    syncSessionWithValidatedCart(
      { adoptedSalesChannel: '4', itemCount: 1 },
      s.read,
      s.setSilent
    )

    expect(s.channel()).toMatchObject({
      salesChannel: '4',
      salesChannelSource: 'orderForm',
    })
  })

  it('releases the adoption once the validated cart is empty', () => {
    const s = store({ salesChannel: '4', salesChannelSource: 'orderForm' })

    syncSessionWithValidatedCart(
      { adoptedSalesChannel: null, itemCount: 0 },
      s.read,
      s.setSilent
    )

    expect(s.channel()).toEqual({ salesChannel: '4' })
  })

  it('leaves the session untouched when nothing was adopted and the cart has items', () => {
    const s = store({ salesChannel: '4', salesChannelSource: 'orderForm' })

    syncSessionWithValidatedCart(
      { adoptedSalesChannel: undefined, itemCount: 2 },
      s.read,
      s.setSilent
    )

    expect(s.setSilent).not.toHaveBeenCalled()
  })
})
