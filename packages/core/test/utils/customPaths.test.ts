import { vi } from 'vitest'
import { describe, expect, it } from 'vitest'

vi.mock('../../discovery.config.js', async () => {
  const original = await import('../../discovery.config.js')
  return {
    default: {
      ...(original.default ?? {}),
      localization: {
        enabled: true,
        defaultLocale: 'pt-BR',
        locales: {
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
                currencyCode: 'USD',
                url: 'https://brandless.fast.store/it-IT',
                salesChannel: '2',
                isDefault: false,
              },
              {
                currencyCode: 'EUR',
                url: 'https://brandless.fast.store/europe/it',
                salesChannel: '3',
                isDefault: false,
              },
            ],
          },
          'fr-CA': {
            code: 'fr-CA',
            name: 'français',
            languageCode: 'fr',
            languageName: 'French',
            script: 'Latn',
            textDirection: 'ltr',
            regionCode: 'CA',
            bindings: [
              {
                currencyCode: 'CAD',
                url: 'https://brandless.fast.store/it',
                salesChannel: '4',
                isDefault: false,
              },
              {
                currencyCode: 'USD',
                url: 'https://brandless.fast.store/pt',
                salesChannel: '5',
                isDefault: false,
              },
              {
                currencyCode: 'EUR',
                url: 'https://brandless.fast.store/europe',
                salesChannel: '6',
                isDefault: false,
              },
            ],
          },
        },
      },
    },
  }
})

import {
  getCustomPathsFromBindings,
  isCustomPath,
  addCustomPathPrefix,
} from '../../src/utils/customPaths'

describe('customPaths', () => {
  describe('isCustomPath', () => {
    it('returns false for root path', () => {
      expect(isCustomPath('https://example.com/')).toBe(false)
      expect(isCustomPath('https://example.com')).toBe(false)
    })

    it('returns false for canonical locale paths', () => {
      expect(isCustomPath('https://example.com/pt-BR')).toBe(false)
      expect(isCustomPath('https://example.com/en-US/')).toBe(false)
      expect(isCustomPath('https://example.com/it-IT')).toBe(false)
    })

    it('returns true for custom paths', () => {
      expect(isCustomPath('https://example.com/pt/br')).toBe(true)
      expect(isCustomPath('https://example.com/europe/it')).toBe(true)
      expect(isCustomPath('https://example.com/america/pt')).toBe(true)
    })

    it('returns false for invalid URLs', () => {
      expect(isCustomPath('not-a-url')).toBe(false)
      expect(isCustomPath('')).toBe(false)
    })
  })

  describe('getCustomPathsFromBindings', () => {
    it('returns an array', () => {
      const paths = getCustomPathsFromBindings()
      expect(Array.isArray(paths)).toBe(true)
    })

    it('returns paths sorted by length (longest first)', () => {
      const paths = getCustomPathsFromBindings()

      if (paths.length > 1) {
        for (let i = 0; i < paths.length - 1; i++) {
          expect(paths[i].path.length).toBeGreaterThanOrEqual(
            paths[i + 1].path.length
          )
        }
      }
    })

    it('returns paths with locale information', () => {
      const paths = getCustomPathsFromBindings()

      paths.forEach((pathInfo) => {
        expect(pathInfo).toHaveProperty('path')
        expect(pathInfo).toHaveProperty('locale')
        expect(typeof pathInfo.path).toBe('string')
        expect(typeof pathInfo.locale).toBe('string')
      })
    })
  })

  describe('addCustomPathPrefix', () => {
    it('returns link as-is if it does not start with /', () => {
      expect(addCustomPathPrefix('https://example.com', '/europe/it')).toBe(
        'https://example.com'
      )
      expect(addCustomPathPrefix('mailto:test@example.com', '/europe/it')).toBe(
        'mailto:test@example.com'
      )
    })

    it('returns link as-is if it already has custom path prefix', () => {
      const link = '/europe/it/apparel'
      const currentPath = '/europe/it/sporting'
      const result = addCustomPathPrefix(link, currentPath)

      expect(result).toBe(link)
    })

    it('adds prefix when link does not have one and current path has prefix', () => {
      const link = '/apparel'
      const currentPath = '/europe/it/sporting'

      const result = addCustomPathPrefix(link, currentPath)

      if (currentPath.startsWith('/europe/it')) {
        expect(result).toBe('/europe/it/apparel')
      }
    })

    it('returns link as-is when current path has no custom prefix', () => {
      const link = '/apparel'
      const currentPath = '/pt-BR/apparel'

      const result = addCustomPathPrefix(link, currentPath)

      expect(result).toBe(link)
    })

    it('handles root path correctly', () => {
      const link = '/'
      const currentPath = '/europe/it/apparel'

      const result = addCustomPathPrefix(link, currentPath)

      if (currentPath.startsWith('/europe/it')) {
        expect(result).toBe('/europe/it/')
      }
    })

    describe('partial prefix match prevention', () => {
      it('should match exact custom path', () => {
        const link = '/apparel'
        const currentPath = '/it'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/it/apparel')
      })

      it('should match custom path with segment boundary', () => {
        const link = '/apparel'
        const currentPath = '/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/it/apparel')
      })

      it('should NOT match partial prefix (/it vs /item)', () => {
        const link = '/apparel'
        const currentPath = '/item'
        const result = addCustomPathPrefix(link, currentPath)

        // /item should NOT be treated as having /it prefix
        expect(result).toBe('/apparel')
      })

      it('should NOT match partial prefix (/pt vs /pt-BR)', () => {
        const link = '/apparel'
        const currentPath = '/pt-BR'
        const result = addCustomPathPrefix(link, currentPath)

        // /pt-BR is canonical, not custom path /pt
        expect(result).toBe('/apparel')
      })

      it('should NOT match partial prefix (/europe vs /european)', () => {
        const link = '/apparel'
        const currentPath = '/european'
        const result = addCustomPathPrefix(link, currentPath)

        // /european should NOT be treated as having /europe prefix
        expect(result).toBe('/apparel')
      })

      it('should match longer custom path when both exist (/europe/it vs /it)', () => {
        const link = '/apparel'
        const currentPath = '/europe/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        // Should match /europe/it (longer) not /it
        expect(result).toBe('/europe/it/apparel')
      })

      it('should handle exact match at root level', () => {
        const link = '/apparel'
        const currentPath = '/europe'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/europe/apparel')
      })

      it('should handle exact match with trailing slash', () => {
        const link = '/apparel'
        const currentPath = '/europe/'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/europe/apparel')
      })
    })

    describe('hasCustomPathPrefix edge cases', () => {
      it('should detect link with exact custom path prefix', () => {
        const link = '/it/apparel'
        const currentPath = '/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/it/apparel')
      })

      it('should NOT detect partial match as prefix (/item vs /it)', () => {
        const link = '/item/apparel'
        const currentPath = '/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/it/item/apparel')
      })

      it('should detect longer custom path prefix correctly', () => {
        const link = '/europe/it/apparel'
        const currentPath = '/europe/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/europe/it/apparel')
      })

      it('should detect shorter custom path prefix when link has it', () => {
        const link = '/it/apparel'
        const currentPath = '/europe/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/it/apparel')
      })
    })
  })
})
