import { describe, expect, it } from 'vitest'

import {
  buildLanguageOptions,
  getCurrenciesForLocale,
  isValidUrl,
  resolveBinding,
} from '../../../src/sdk/i18n/bindingSelector'
import type { Locale } from '../../../src/sdk/i18n/types'

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
    it('disambiguates languages with same languageName', () => {
      const languages = buildLanguageOptions(mockLocales)

      // Portuguese appears in both BR and PT
      expect(languages['pt-BR']).toBe('Portuguese (BR)')
      expect(languages['pt-PT']).toBe('Portuguese (PT)')

      // English and French are unique
      expect(languages['en-US']).toBe('English')
      expect(languages['fr-FR']).toBe('French')
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
      // Step 1: Build language options (locale code → language name)
      const languages = buildLanguageOptions(mockLocales)
      expect(languages['pt-BR']).toBe('Portuguese (BR)')

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
})
