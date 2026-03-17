import { describe, expect, it, vi } from 'vitest'

vi.mock('../../../discovery.config.js', async () => {
  const original = await vi.importActual('../../../discovery.config.js')
  return {
    default: {
      ...(original.default ?? {}),
      localization: {
        enabled: true,
        defaultLocale: 'pt-BR',
        locales: {
          'fr-FR': {
            code: 'fr-FR',
            name: 'français',
            languageCode: 'fr',
            languageName: 'French',
            script: 'Latn',
            textDirection: 'ltr',
            regionCode: 'FR',
            bindings: [
              {
                currencyCode: 'EUR',
                // Domain-only binding (no path) – links must not get /fr-FR prefix
                url: 'https://fr.brandless.fast.store',
                salesChannel: '3',
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
                url: 'https://brandless.myvtex.com',
                salesChannel: '1',
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
                url: 'https://brandless.fast.store/europe/it',
                salesChannel: '2',
                isDefault: false,
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
                url: 'https://brandless.fast.store/en-US',
                salesChannel: '3',
                isDefault: true,
              },
            ],
          },
        },
      },
    },
  }
})

import { resolveHref } from '../../../src/sdk/ui/useLink'

describe('resolveHref', () => {
  describe('returns undefined for empty/null/undefined href', () => {
    it('returns undefined for undefined', () => {
      expect(resolveHref(undefined)).toBeUndefined()
    })

    it('returns undefined for empty string', () => {
      expect(resolveHref('')).toBeUndefined()
    })
  })

  describe('returns absolute URLs unchanged', () => {
    it('returns https URL as-is', () => {
      expect(resolveHref('https://checkout.vtex.com/cart')).toBe(
        'https://checkout.vtex.com/cart'
      )
    })

    it('returns http URL as-is', () => {
      expect(resolveHref('http://example.com')).toBe('http://example.com')
    })

    it('returns mailto as-is', () => {
      expect(resolveHref('mailto:test@example.com')).toBe(
        'mailto:test@example.com'
      )
    })
  })

  describe('returns protocol-relative URLs unchanged', () => {
    it('does not transform //example.com/path', () => {
      expect(resolveHref('//example.com/path')).toBe('//example.com/path')
    })
  })

  describe('prepends locale for non-default locale without custom path', () => {
    it('prepends /en-US to relative path', () => {
      const result = resolveHref('/apparel', {
        locale: 'en-US',
        asPath: '/',
      })

      expect(result).toBe('/en-US/apparel')
    })

    it('prepends /en-US to root path', () => {
      const result = resolveHref('/', {
        locale: 'en-US',
        asPath: '/',
      })

      expect(result).toBe('/en-US/')
    })
  })

  describe('does NOT prepend locale for default locale', () => {
    it('returns path unchanged for default locale pt-BR', () => {
      const result = resolveHref('/apparel', {
        locale: 'pt-BR',
        asPath: '/',
      })

      expect(result).toBe('/apparel')
    })
  })

  describe('does NOT prepend locale when locale has domain-based binding', () => {
    it('keeps relative path when locale is served via subdomain', () => {
      // locale fr-FR point to a sub domain fr.brandless.fast.store
      // so the link should not be prefixed with /fr-FR
      const result = resolveHref('/apparel', {
        locale: 'fr-FR',
        asPath: '/sporting',
      })

      expect(result).toBe('/apparel')
    })
  })

  describe('does NOT prepend locale when on a custom binding path', () => {
    it('adds custom path prefix instead of locale segment', () => {
      const result = resolveHref('/apparel', {
        locale: 'it-IT',
        asPath: '/europe/it/sporting',
      })

      expect(result).toBe('/europe/it/apparel')
    })
  })

  describe('applies custom path prefix from current page', () => {
    it('inherits /europe/it prefix from asPath', () => {
      const result = resolveHref('/products', {
        locale: 'pt-BR',
        asPath: '/europe/it/home',
      })

      expect(result).toBe('/europe/it/products')
    })

    it('does not double-prefix when href already has it', () => {
      const result = resolveHref('/europe/it/products', {
        locale: 'it-IT',
        asPath: '/europe/it/home',
      })

      expect(result).toBe('/europe/it/products')
    })
  })

  describe('works without context (defaults)', () => {
    it('returns relative path unchanged with no context', () => {
      const result = resolveHref('/apparel')

      expect(result).toBe('/apparel')
    })

    it('returns relative path with empty context', () => {
      const result = resolveHref('/apparel', {})

      expect(result).toBe('/apparel')
    })
  })

  describe('preserves query string and hash', () => {
    it('preserves query when prepending locale', () => {
      const result = resolveHref('/apparel?color=red', {
        locale: 'en-US',
        asPath: '/',
      })

      expect(result).toBe('/en-US/apparel?color=red')
    })

    it('preserves hash when prepending locale', () => {
      const result = resolveHref('/apparel#section', {
        locale: 'en-US',
        asPath: '/',
      })

      expect(result).toBe('/en-US/apparel#section')
    })

    it('preserves query when applying custom path prefix', () => {
      const result = resolveHref('/apparel?sort=price', {
        locale: 'it-IT',
        asPath: '/europe/it/home',
      })

      expect(result).toBe('/europe/it/apparel?sort=price')
    })
  })
})
