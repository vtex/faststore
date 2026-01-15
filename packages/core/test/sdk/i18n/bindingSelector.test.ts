import { describe, expect, it } from 'vitest'

import {
  buildLanguageOptions,
  getCurrenciesForLocale,
  isValidUrl,
  resolveBinding,
} from '../../../src/sdk/i18n/bindingSelector'
import type { Binding, Locale } from '../../../src/sdk/i18n/types'

// Helper to create a mock locale
function createLocale(overrides: Partial<Locale> = {}): Locale {
  return {
    code: 'en-US',
    name: 'English',
    languageCode: 'en',
    languageName: 'English',
    script: 'Latn',
    textDirection: 'ltr',
    regionCode: 'US',
    bindings: [],
    ...overrides,
  }
}

// Helper to create a mock binding
function createBinding(overrides: Partial<Binding> = {}): Binding {
  return {
    currencyCode: 'USD',
    url: 'https://store.example.com/en-US',
    salesChannel: '1',
    isDefault: false,
    ...overrides,
  }
}

// Helper to create a locale with simplified parameters
function makeLocale(code: string, languageName: string): Locale {
  const [languageCode, regionCode] = code.split('-')
  return createLocale({
    code,
    languageName,
    languageCode,
    regionCode,
  })
}

describe('buildLanguageOptions', () => {
  it('displays only languageName when unique', () => {
    const locales: Record<string, Locale> = {
      'fr-FR': makeLocale('fr-FR', 'Français'),
      'en-US': makeLocale('en-US', 'English'),
    }

    const options = buildLanguageOptions(locales)

    expect(options['fr-FR']).toBe('Français')
    expect(options['en-US']).toBe('English')
  })

  it('adds regionCode when languageName is duplicated', () => {
    const locales: Record<string, Locale> = {
      'pt-BR': makeLocale('pt-BR', 'Português'),
      'pt-PT': makeLocale('pt-PT', 'Português'),
    }

    const options = buildLanguageOptions(locales)

    expect(options['pt-BR']).toBe('Português (BR)')
    expect(options['pt-PT']).toBe('Português (PT)')
  })

  it('handles mixed unique and duplicated languageNames', () => {
    const locales: Record<string, Locale> = {
      'en-US': makeLocale('en-US', 'English'),
      'pt-BR': makeLocale('pt-BR', 'Português'),
      'pt-PT': makeLocale('pt-PT', 'Português'),
      'fr-FR': makeLocale('fr-FR', 'Français'),
    }

    const options = buildLanguageOptions(locales)

    expect(options['en-US']).toBe('English')
    expect(options['pt-BR']).toBe('Português (BR)')
    expect(options['pt-PT']).toBe('Português (PT)')
    expect(options['fr-FR']).toBe('Français')
  })

  it('returns empty object for empty locales', () => {
    const options = buildLanguageOptions({})
    expect(options).toEqual({})
  })
})

describe('getCurrenciesForLocale', () => {
  const testCases = [
    {
      name: 'returns unique currencies from bindings',
      bindings: [
        createBinding({ currencyCode: 'BRL' }),
        createBinding({ currencyCode: 'USD' }),
        createBinding({ currencyCode: 'BRL' }), // duplicate
      ],
      expected: ['BRL', 'USD'],
    },
    {
      name: 'returns single currency when only one binding',
      bindings: [createBinding({ currencyCode: 'EUR' })],
      expected: ['EUR'],
    },
    {
      name: 'returns empty array when no bindings',
      bindings: [],
      expected: [],
    },
    {
      name: 'preserves order of first occurrence',
      bindings: [
        createBinding({ currencyCode: 'USD' }),
        createBinding({ currencyCode: 'EUR' }),
        createBinding({ currencyCode: 'BRL' }),
        createBinding({ currencyCode: 'USD' }), // duplicate
      ],
      expected: ['USD', 'EUR', 'BRL'],
    },
  ]

  testCases.forEach(({ name, bindings, expected }) => {
    it(name, () => {
      const locale = createLocale({ bindings })
      const currencies = getCurrenciesForLocale(locale)
      expect(currencies).toEqual(expected)
    })
  })
})

describe('resolveBinding', () => {
  const mockBindings = {
    usd: () =>
      createBinding({ currencyCode: 'USD', url: 'https://usd.example.com' }),
    eur: () =>
      createBinding({ currencyCode: 'EUR', url: 'https://eur.example.com' }),
    brl: (isDefault: boolean, salesChannel: string) =>
      createBinding({
        currencyCode: 'BRL',
        isDefault,
        url: `https://brl${salesChannel}.example.com`,
        salesChannel,
      }),
  }

  it('returns null when no bindings match currency', () => {
    const bindings = [mockBindings.usd(), mockBindings.eur()]

    const result = resolveBinding(bindings, 'BRL')

    expect(result).toBeNull()
  })

  it('returns single match when only one binding matches', () => {
    const bindings = [mockBindings.usd(), mockBindings.eur()]

    const result = resolveBinding(bindings, 'USD')

    expect(result?.url).toBe('https://usd.example.com')
  })

  it('applies isDefault tie-breaker when multiple bindings match', () => {
    const bindings = [mockBindings.brl(false, '1'), mockBindings.brl(true, '2')]

    const result = resolveBinding(bindings, 'BRL')

    expect(result?.url).toBe('https://brl2.example.com')
    expect(result?.salesChannel).toBe('2')
  })

  it('falls back to first match when no isDefault exists', () => {
    const bindings = [
      mockBindings.brl(false, '1'),
      mockBindings.brl(false, '2'),
    ]

    const result = resolveBinding(bindings, 'BRL')

    expect(result?.url).toBe('https://brl1.example.com')
    expect(result?.salesChannel).toBe('1')
  })

  it('returns null for empty bindings array', () => {
    const result = resolveBinding([], 'USD')

    expect(result).toBeNull()
  })

  it('handles multiple currencies with isDefault correctly', () => {
    const bindings = [
      createBinding({
        currencyCode: 'USD',
        isDefault: true,
        url: 'https://usd-default.example.com',
      }),
      createBinding({
        currencyCode: 'USD',
        isDefault: false,
        url: 'https://usd-secondary.example.com',
      }),
      createBinding({
        currencyCode: 'EUR',
        isDefault: true,
        url: 'https://eur-default.example.com',
      }),
    ]

    const usdResult = resolveBinding(bindings, 'USD')
    const eurResult = resolveBinding(bindings, 'EUR')

    expect(usdResult?.url).toBe('https://usd-default.example.com')
    expect(eurResult?.url).toBe('https://eur-default.example.com')
  })
})

describe('isValidUrl', () => {
  it('returns true for valid absolute URLs', () => {
    expect(isValidUrl('https://store.example.com')).toBe(true)
    expect(isValidUrl('https://store.example.com/pt-BR')).toBe(true)
    expect(isValidUrl('http://localhost:3000')).toBe(true)
    expect(isValidUrl('https://sub.domain.example.com/path?query=1')).toBe(true)
  })

  it('returns false for empty or whitespace URLs', () => {
    expect(isValidUrl('')).toBe(false)
    expect(isValidUrl('   ')).toBe(false)
  })

  it('returns false for invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false)
    expect(isValidUrl('store.example.com')).toBe(false) // missing protocol
    expect(isValidUrl('/relative/path')).toBe(false)
  })

  it('returns false for null-like values', () => {
    // TypeScript should prevent this, but test runtime behavior
    expect(isValidUrl(null as unknown as string)).toBe(false)
    expect(isValidUrl(undefined as unknown as string)).toBe(false)
  })
})
