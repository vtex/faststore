import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock(import('../../../discovery.config.js'), async (original) => ({
  default: {
    ...((await original()).default ?? (await original())),
    localization: {
      enabled: true,
      defaultLocale: 'en-US',
      regions: {
        US: {
          code: 'US',
          name: 'United States',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timeFormatMask: 'hh:mm a',
          unitSystem: 'imperial',
          defaultTimezone: 'GMT-5',
        },
        BR: {
          code: 'BR',
          name: 'Brazil',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          timeFormatMask: 'HH:mm',
          unitSystem: 'metric',
          defaultTimezone: 'GMT-3',
        },
        IT: {
          code: 'IT',
          name: 'Italy',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          timeFormatMask: 'HH:mm',
          unitSystem: 'metric',
          defaultTimezone: 'GMT+1',
        },
      },
      locales: {
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
              url: 'https://store.example.com',
              salesChannel: '1',
              isDefault: true,
            },
          ],
        },
        'pt-BR': {
          code: 'pt-BR',
          name: 'português',
          languageCode: 'pt',
          languageName: 'Portuguese',
          script: 'Latn',
          textDirection: 'ltr',
          regionCode: 'BR',
          bindings: [
            {
              currencyCode: 'BRL',
              url: 'https://store.example.com/pt-BR',
              salesChannel: '2',
              isDefault: true,
            },
          ],
        },
        'it-IT': {
          code: 'it-IT',
          name: 'italiano',
          languageCode: 'it',
          languageName: 'Italian',
          script: 'Latn',
          textDirection: 'ltr',
          regionCode: 'IT',
          bindings: [
            {
              currencyCode: 'EUR',
              url: 'https://store.example.com/it-IT',
              salesChannel: '3',
              isDefault: true,
            },
          ],
        },
      },
      currencies: {
        USD: { code: 'USD', name: 'US Dollar', symbol: '$' },
        BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
        EUR: { code: 'EUR', name: 'Euro', symbol: '€' },
      },
    },
  },
}))

vi.mock('../../../src/sdk/session', () => ({
  useSession: () => ({
    locale: 'en-US',
    currency: { code: 'USD', symbol: '$' },
  }),
}))

import { useBindingSelector } from '../../../src/sdk/localization/useBindingSelector'

const TRANSLATED = [
  { locale: 'en-US', slug: 'roshe-tenis-76' },
  { locale: 'pt-BR', slug: 'tenis-roshe-76' },
]

/**
 * Replaces `globalThis.location` with a plain object so the redirect can be
 * asserted. jsdom throws on a real `href` assignment.
 */
function stubLocation(pathname: string, search = '', hash = '') {
  const location = { pathname, search, hash, href: '' }
  vi.stubGlobal('location', location)

  return location
}

/** Drives the selector to a locale/currency pair and triggers the redirect. */
function switchTo(
  locale: string,
  currency: string,
  otherLocales?: Array<{ locale: string; slug: string }> | null,
  defaultLocaleSlug?: string | null,
  urlSuffix = '/p'
) {
  const { result } = renderHook(() =>
    useBindingSelector(otherLocales, urlSuffix, defaultLocaleSlug)
  )

  act(() => result.current.setLocaleCode(locale))
  act(() => result.current.setCurrencyCode(currency))
  act(() => result.current.save())

  return result
}

describe('useBindingSelector redirect', () => {
  beforeEach(() => {
    globalThis.sessionStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('navigates to the slug the catalog registered for the target locale', () => {
    const location = stubLocation('/roshe-tenis-76/p')

    switchTo('pt-BR', 'BRL', TRANSLATED)

    expect(location.href).toBe(
      'https://store.example.com/pt-BR/tenis-roshe-76/p'
    )
  })

  it('falls back to the default locale slug registered in the map when the target has none', () => {
    const location = stubLocation('/tenis-roshe-76/p')

    switchTo('it-IT', 'EUR', TRANSLATED)

    expect(location.href).toBe(
      'https://store.example.com/it-IT/roshe-tenis-76/p'
    )
  })

  it('navigates to the product page via defaultLocaleSlug when the target locale has no registered slug', () => {
    const location = stubLocation('/roshe-tenis-76/p')

    switchTo(
      'it-IT',
      'EUR',
      [{ locale: 'pt-BR', slug: 'tenis-roshe-76' }],
      'roshe-tenis-76'
    )

    // The Italian binding with the default-locale slug: an untranslated product
    // page, which the agreed behavior prefers over the locale root.
    expect(location.href).toBe(
      'https://store.example.com/it-IT/roshe-tenis-76/p'
    )
  })

  it('uses defaultLocaleSlug for a product with no registered translations at all', () => {
    const location = stubLocation('/side-by-side-refrigerator-14/p')

    switchTo('pt-BR', 'BRL', [], 'side-by-side-refrigerator-14')

    expect(location.href).toBe(
      'https://store.example.com/pt-BR/side-by-side-refrigerator-14/p'
    )
  })

  it('never carries a slug registered for a third locale into the target locale', () => {
    const location = stubLocation('/roshe-tenis-76/p')

    switchTo(
      'it-IT',
      'EUR',
      [{ locale: 'pt-BR', slug: 'tenis-roshe-76' }],
      'roshe-tenis-76'
    )

    expect(location.href).not.toContain('tenis-roshe-76')
  })

  it('falls back to the binding root on a PDP with no slug available', () => {
    const location = stubLocation('/roshe-tenis-76/p')

    switchTo('pt-BR', 'BRL', [], null)

    expect(location.href).toBe('https://store.example.com/pt-BR')
  })

  it('preserves the query string and hash across the switch', () => {
    const location = stubLocation('/roshe-tenis-76/p', '?skuId=76', '#reviews')

    switchTo('pt-BR', 'BRL', TRANSLATED)

    expect(location.href).toBe(
      'https://store.example.com/pt-BR/tenis-roshe-76/p?skuId=76#reviews'
    )
  })

  it('omits the /p suffix for collection pages', () => {
    const location = stubLocation('/apparel')

    switchTo('pt-BR', 'BRL', [{ locale: 'pt-BR', slug: 'vestuario' }], null, '')

    expect(location.href).toBe('https://store.example.com/pt-BR/vestuario')
  })

  it('reports an error instead of redirecting when the locale has no binding for the currency', () => {
    const location = stubLocation('/roshe-tenis-76/p')

    const result = switchTo('pt-BR', 'JPY', TRANSLATED)

    expect(result.current.error).toEqual({
      type: 'no-binding-found',
      locale: 'pt-BR',
      currency: 'JPY',
    })
    expect(location.href).toBe('')
  })
})
