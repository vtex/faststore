import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  buildLanguageOptions,
  getCurrenciesForLocale,
  isValidUrl,
  resolveBinding,
} from '../../../src/sdk/localization/bindingSelector'
import type { LocalizedProductLocale } from '../../../src/sdk/localization/LocalizedProductContext'
import type { Locale } from '../../../src/sdk/localization/types'
import {
  getSkuIdFromPdpPath,
  persistOtherLocales,
  recoverOtherLocales,
} from '../../../src/sdk/localization/useBindingSelector'

/** In-memory Storage stub matching the subset used by the helpers. */
function createFakeStorage() {
  const map = new Map<string, string>()

  return {
    getItem: (key: string) => (map.has(key) ? (map.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      map.set(key, value)
    },
    removeItem: (key: string) => {
      map.delete(key)
    },
    clear: () => map.clear(),
  }
}

/**
 * Stubs a browser-like global scope with the given pathname and storage.
 *
 * The production helpers guard on `typeof window` but read `globalThis.location`
 * / `globalThis.sessionStorage` (which coincide with `window` in a real browser).
 * Under the node test environment those are distinct, so we stub all three: the
 * `window` keeps the guard passing while `location`/`sessionStorage` back the reads.
 * Pass an existing `sessionStorage` to simulate navigation while storage persists.
 */
function stubWindow(pathname: string, sessionStorage = createFakeStorage()) {
  const location = { pathname }
  vi.stubGlobal('window', { location, sessionStorage })
  vi.stubGlobal('location', location)
  vi.stubGlobal('sessionStorage', sessionStorage)

  return sessionStorage
}

// Test data that mirrors what the hook would receive from discovery.config
const mockLocales: Record<string, Locale> = {
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
        salesChannel: '1',
        isDefault: true,
      },
    ],
  },
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
        salesChannel: '2',
        isDefault: true,
      },
      {
        currencyCode: 'USD',
        url: 'https://store.example.com/pt-BR-usd',
        salesChannel: '3',
        isDefault: false,
      },
    ],
  },
  'pt-PT': {
    code: 'pt-PT',
    name: 'Português',
    languageCode: 'pt',
    languageName: 'Portuguese',
    script: 'Latn',
    textDirection: 'ltr',
    regionCode: 'PT',
    bindings: [
      {
        currencyCode: 'EUR',
        url: 'https://store.example.com/pt-PT',
        salesChannel: '4',
        isDefault: true,
      },
    ],
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'Français',
    languageCode: 'fr',
    languageName: 'French',
    script: 'Latn',
    textDirection: 'ltr',
    regionCode: 'FR',
    bindings: [
      {
        currencyCode: 'EUR',
        url: 'https://store.example.com/fr-FR',
        salesChannel: '5',
        isDefault: true,
      },
      {
        currencyCode: 'EUR',
        url: 'https://store.example.com/fr-FR-alt',
        salesChannel: '6',
        isDefault: false,
      },
    ],
  },
}

describe('useBindingSelector integration scenarios', () => {
  describe('language options computation', () => {
    it('disambiguates languages with same name (native name, first letter capitalized)', () => {
      const languages = buildLanguageOptions(mockLocales)

      // Português appears in both BR and PT → disambiguate with region
      expect(languages['pt-BR']).toBe('Português (BR)')
      expect(languages['pt-PT']).toBe('Português (PT)')

      // English and Français are unique
      expect(languages['en-US']).toBe('English')
      expect(languages['fr-FR']).toBe('Français')
    })

    it('returns Record<string, string> format for UISelectField', () => {
      const languages = buildLanguageOptions(mockLocales)

      // Verify structure matches UISelectField options format
      expect(typeof languages).toBe('object')
      Object.entries(languages).forEach(([key, value]) => {
        expect(typeof key).toBe('string')
        expect(typeof value).toBe('string')
      })
    })
  })

  describe('currency filtering by locale', () => {
    it('returns currencies available for pt-BR locale', () => {
      const currencies = getCurrenciesForLocale(mockLocales['pt-BR'])

      expect(currencies).toEqual(['BRL', 'USD'])
    })

    it('returns single currency for en-US locale', () => {
      const currencies = getCurrenciesForLocale(mockLocales['en-US'])

      expect(currencies).toEqual(['USD'])
    })

    it('returns single currency for pt-PT locale', () => {
      const currencies = getCurrenciesForLocale(mockLocales['pt-PT'])

      expect(currencies).toEqual(['EUR'])
    })
  })

  describe('binding resolution with isDefault tie-breaker', () => {
    it('selects isDefault binding when multiple exist for same currency', () => {
      // fr-FR has two EUR bindings
      const binding = resolveBinding(mockLocales['fr-FR'].bindings, 'EUR')

      expect(binding?.url).toBe('https://store.example.com/fr-FR')
      expect(binding?.isDefault).toBe(true)
    })

    it('selects correct binding for pt-BR with BRL', () => {
      const binding = resolveBinding(mockLocales['pt-BR'].bindings, 'BRL')

      expect(binding?.url).toBe('https://store.example.com/pt-BR')
      expect(binding?.salesChannel).toBe('2')
    })

    it('selects correct binding for pt-BR with USD', () => {
      const binding = resolveBinding(mockLocales['pt-BR'].bindings, 'USD')

      expect(binding?.url).toBe('https://store.example.com/pt-BR-usd')
      expect(binding?.salesChannel).toBe('3')
    })

    it('returns null for non-existent currency', () => {
      const binding = resolveBinding(mockLocales['en-US'].bindings, 'EUR')

      expect(binding).toBeNull()
    })
  })

  describe('URL validation', () => {
    it('validates binding URLs', () => {
      // All mock URLs should be valid
      Object.values(mockLocales).forEach((locale) => {
        locale.bindings.forEach((binding) => {
          expect(isValidUrl(binding.url)).toBe(true)
        })
      })
    })
  })

  describe('complete flow simulation', () => {
    it('simulates user selecting pt-BR then BRL', () => {
      // Step 1: Build language options (locale code → native name, capitalized)
      const languages = buildLanguageOptions(mockLocales)
      expect(languages['pt-BR']).toBe('Português (BR)')

      // Step 2: User selects pt-BR locale, get currencies
      const currencies = getCurrenciesForLocale(mockLocales['pt-BR'])
      expect(currencies).toContain('BRL')
      expect(currencies).toContain('USD')

      // Step 3: User selects BRL currency, resolve binding
      const binding = resolveBinding(mockLocales['pt-BR'].bindings, 'BRL')
      expect(binding).not.toBeNull()

      // Step 4: Validate URL before redirect
      expect(isValidUrl(binding!.url)).toBe(true)
      expect(binding!.url).toBe('https://store.example.com/pt-BR')
    })

    it('simulates user changing from en-US to pt-PT', () => {
      // Initial: en-US locale with USD
      const initialCurrencies = getCurrenciesForLocale(mockLocales['en-US'])
      expect(initialCurrencies).toEqual(['USD'])

      // User changes to pt-PT locale
      const newCurrencies = getCurrenciesForLocale(mockLocales['pt-PT'])
      expect(newCurrencies).toEqual(['EUR'])

      // USD is not available in pt-PT
      expect(newCurrencies.includes('USD')).toBe(false)

      // Only EUR is available, so it would be auto-selected
      expect(newCurrencies.length).toBe(1)
      expect(newCurrencies[0]).toBe('EUR')
    })
  })

  describe('getSkuIdFromPdpPath', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('extracts the SKU id from a locale-prefixed PDP path', () => {
      expect(
        getSkuIdFromPdpPath(
          '/en-CA/adidas-mens-performance-polo-blast-blue-65/p'
        )
      ).toBe('65')
    })

    it('extracts the SKU id from a default-locale (root) PDP path', () => {
      expect(
        getSkuIdFromPdpPath('/adidas-mens-performance-polo-blast-blue-65/p')
      ).toBe('65')
    })

    it('extracts the SKU id from a custom-path binding PDP', () => {
      expect(getSkuIdFromPdpPath('/europe/it/some-product-slug-12/p')).toBe(
        '12'
      )
    })

    it('handles a trailing slash after /p', () => {
      expect(getSkuIdFromPdpPath('/pt-BR/some-slug-9/p/')).toBe('9')
    })

    it('returns null for non-PDP paths', () => {
      expect(getSkuIdFromPdpPath('/en-CA')).toBeNull()
      expect(getSkuIdFromPdpPath('/en-CA/office')).toBeNull()
      expect(getSkuIdFromPdpPath('/')).toBeNull()
    })

    it('returns null when the slug has no numeric id', () => {
      expect(getSkuIdFromPdpPath('/en-CA/no-numeric-id/p')).toBeNull()
    })
  })

  describe('persist / recover otherLocales (sessionStorage)', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    const otherLocales: LocalizedProductLocale[] = [
      { locale: 'en-US', slug: 'adidas-mens-performance-polo-blast-blue-65' },
      {
        locale: 'pt-BR',
        slug: 'adidas-polo-performance-masculina-azul-blast-65',
      },
      {
        locale: 'fr-CA',
        slug: 'adidas-polo-performance-homme-bleu-blast-ca-65',
      },
    ]

    it('round-trips the map for the SKU referenced by the current path', () => {
      // Persisted while on a working PDP (SKU 65).
      const storage = stubWindow(
        '/adidas-mens-performance-polo-blast-blue-65/p'
      )
      persistOtherLocales(otherLocales)

      // Later, on a 404 for en-CA (same SKU 65, default-locale slug in the URL).
      stubWindow('/en-CA/adidas-mens-performance-polo-blast-blue-65/p', storage)

      expect(recoverOtherLocales()).toEqual(otherLocales)
    })

    it('returns null when the current path references a different SKU', () => {
      const storage = stubWindow(
        '/adidas-mens-performance-polo-blast-blue-65/p'
      )
      persistOtherLocales(otherLocales)

      stubWindow('/en-CA/some-other-product-99/p', storage)

      expect(recoverOtherLocales()).toBeNull()
    })

    it('returns null when the current path is not a PDP', () => {
      const storage = stubWindow(
        '/adidas-mens-performance-polo-blast-blue-65/p'
      )
      persistOtherLocales(otherLocales)

      stubWindow('/en-CA', storage)

      expect(recoverOtherLocales()).toBeNull()
    })

    it('does not persist when otherLocales is empty', () => {
      const storage = stubWindow(
        '/adidas-mens-performance-polo-blast-blue-65/p'
      )
      persistOtherLocales([])

      expect(recoverOtherLocales()).toBeNull()
      expect(storage.getItem('fs:otherLocales:65')).toBeNull()
    })
  })
})
