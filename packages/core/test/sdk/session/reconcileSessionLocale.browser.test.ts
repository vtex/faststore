/**
 * Tests for the localization reconcile seam.
 *
 * `reconcileSessionLocale` is wired into the SDK `persisted` middleware (via
 * `createSessionStore({ reconcile })`) and runs every time a payload flows from
 * IDB into memory — both on hydration and on the `focus`/`visibilitychange`
 * cross-tab sync. It forces `locale`/`currency`/`salesChannel` to follow the
 * URL (the single source of truth) while preserving every other field from the
 * persisted payload. This replaces the previous one-shot `installLocaleCorrector`
 * subscriber, which only fixed memory on the first hydration and never covered
 * the focus sync.
 */
import type { Session } from '@faststore/sdk'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock(import('../../../discovery.config.js'), async (original) => ({
  default: {
    ...((await original()).default ?? (await original())),
    localization: {
      enabled: true,
      defaultLocale: 'pt-BR',
      regions: {
        BR: {
          code: 'BR',
          name: 'Brazil',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          timeFormatMask: 'HH:mm',
          unitSystem: 'metric',
          defaultTimezone: 'GMT-3',
        },
        US: {
          code: 'US',
          name: 'United States',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timeFormatMask: 'hh:mm a',
          unitSystem: 'imperial',
          defaultTimezone: 'GMT-5',
        },
      },
      locales: {
        'pt-BR': {
          code: 'pt-BR',
          name: 'Português',
          languageCode: 'pt',
          languageName: 'Portuguese',
          script: 'Latn',
          textDirection: 'ltr',
          regionCode: 'BR',
          bindings: [
            {
              currencyCode: 'BRL',
              url: 'https://store.example.com/pt-BR',
              salesChannel: '1',
              isDefault: true,
            },
          ],
        },
        'en-US': {
          code: 'en-US',
          name: 'English',
          languageCode: 'en',
          languageName: 'English',
          script: 'Latn',
          textDirection: 'ltr',
          regionCode: 'US',
          bindings: [
            {
              currencyCode: 'USD',
              url: 'https://store.example.com/en-US',
              salesChannel: '2',
              isDefault: false,
            },
          ],
        },
      },
      currencies: {
        BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
        USD: { code: 'USD', name: 'US Dollar', symbol: '$' },
      },
    },
  },
}))

import { reconcileSessionLocale } from '../../../src/sdk/session/initialSession'

const originalLocation = window.location

function stubHref(href: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, href },
  })
}

const STALE: Session = {
  locale: 'en-US',
  currency: { code: 'USD', symbol: '$' },
  channel: '{"salesChannel":"2","regionId":"region-xyz"}',
  country: 'USA',
  deliveryMode: null,
  addressType: null,
  city: null,
  postalCode: null,
  geoCoordinates: null,
  b2b: null,
  person: null,
  marketingData: null,
  refreshAfter: null,
}

describe('reconcileSessionLocale (browser, localization enabled)', () => {
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('forces locale/currency from the URL when the IDB payload is stale', () => {
    stubHref('https://store.example.com/pt-BR/pvt/some/path')

    const result = reconcileSessionLocale(STALE)

    expect(result.locale).toBe('pt-BR')
    expect(result.currency).toEqual({ code: 'BRL', symbol: 'R$' })
  })

  it('preserves unrelated session fields from the payload (e.g. person)', () => {
    stubHref('https://store.example.com/pt-BR/some/path')

    const payload: Session = {
      ...STALE,
      person: { id: 'p1', email: 'a@b.com', givenName: 'A', familyName: 'B' },
      postalCode: '12345',
    }

    const result = reconcileSessionLocale(payload)

    expect(result.locale).toBe('pt-BR')
    expect(result.postalCode).toBe('12345')
    expect(result.person).toEqual({
      id: 'p1',
      email: 'a@b.com',
      givenName: 'A',
      familyName: 'B',
    })
  })

  it('replaces salesChannel inside channel JSON while preserving non-locale channel fields', () => {
    stubHref('https://store.example.com/pt-BR/some/path')

    const payload: Session = {
      ...STALE,
      channel:
        '{"salesChannel":"2","regionId":"region-xyz","customKey":"keep-me"}',
    }

    const result = reconcileSessionLocale(payload)
    const channel = JSON.parse(result.channel ?? '{}')

    expect(channel.salesChannel).toBe('1')
    expect(channel.regionId).toBe('region-xyz')
    expect(channel.customKey).toBe('keep-me')
  })

  it('survives a malformed channel JSON in the payload (does not throw, still reconciles)', () => {
    stubHref('https://store.example.com/pt-BR/some/path')

    const payload: Session = { ...STALE, channel: '{not valid json' }

    let result: Session | undefined
    expect(() => {
      result = reconcileSessionLocale(payload)
    }).not.toThrow()

    expect(result?.locale).toBe('pt-BR')
    const channel = JSON.parse(result?.channel ?? '{}')
    expect(channel.salesChannel).toBe('1')
  })

  it('is idempotent when the payload already matches the URL locale', () => {
    stubHref('https://store.example.com/pt-BR/some/path')

    const aligned: Session = {
      ...STALE,
      locale: 'pt-BR',
      currency: { code: 'BRL', symbol: 'R$' },
      channel: '{"salesChannel":"1","regionId":"region-xyz"}',
    }

    const result = reconcileSessionLocale(aligned)

    expect(result.locale).toBe('pt-BR')
    expect(result.currency).toEqual({ code: 'BRL', symbol: 'R$' })
    expect(JSON.parse(result.channel ?? '{}').salesChannel).toBe('1')
  })
})
