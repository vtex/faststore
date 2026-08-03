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

import { getInitialSession } from '../../../src/sdk/session/initialSession'

const originalLocation = window.location

function stubHref(href: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, href },
  })
}

const defaults: Session = {
  locale: 'en-US',
  currency: { code: 'USD', symbol: '$' },
  channel: '{"salesChannel":"99","regionId":"region-abc"}',
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

describe('getInitialSession (browser, localization enabled)', () => {
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('seeds session with default locale binding when URL matches it', () => {
    stubHref('https://store.example.com/pt-BR/some/path')

    const result = getInitialSession(defaults)

    expect(result.locale).toBe('pt-BR')
    expect(result.currency).toEqual({ code: 'BRL', symbol: 'R$' })
  })

  it('seeds session with non-default locale binding when URL matches it', () => {
    stubHref('https://store.example.com/en-US/some/path')

    const result = getInitialSession(defaults)

    expect(result.locale).toBe('en-US')
    expect(result.currency).toEqual({ code: 'USD', symbol: '$' })
  })

  it('updates salesChannel in channel JSON while preserving unrelated fields', () => {
    stubHref('https://store.example.com/en-US/some/path')

    const result = getInitialSession(defaults)
    const channel = JSON.parse(result.channel ?? '{}')

    expect(channel.salesChannel).toBe('2')
    expect(channel.regionId).toBe('region-abc')
  })

  it('preserves non-locale defaults (country, person, etc.)', () => {
    stubHref('https://store.example.com/en-US/some/path')

    const customDefaults: Session = {
      ...defaults,
      country: 'CUSTOM',
      person: {
        id: 'p1',
        email: 'a@b.com',
        givenName: 'A',
        familyName: 'B',
      },
    }

    const result = getInitialSession(customDefaults)

    expect(result.country).toBe('CUSTOM')
    expect(result.person).toEqual({
      id: 'p1',
      email: 'a@b.com',
      givenName: 'A',
      familyName: 'B',
    })
  })

  it('falls back to the configured default locale when URL matches no binding', () => {
    stubHref('https://unrelated.example.org/foo')

    const result = getInitialSession(defaults)

    // getSettings() returns the defaultLocale settings on no-match.
    expect(result.locale).toBe('pt-BR')
    expect(result.currency).toEqual({ code: 'BRL', symbol: 'R$' })
  })

  it('returns defaults unchanged when defaults param already matches URL', () => {
    stubHref('https://store.example.com/pt-BR/some/path')

    const aligned: Session = {
      ...defaults,
      locale: 'pt-BR',
      currency: { code: 'BRL', symbol: 'R$' },
    }

    const result = getInitialSession(aligned)

    expect(result.locale).toBe('pt-BR')
    expect(result.currency).toEqual({ code: 'BRL', symbol: 'R$' })
  })
})
