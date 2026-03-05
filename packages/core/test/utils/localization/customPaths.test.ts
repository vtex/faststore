import { describe, expect, it, vi } from 'vitest'
import {
  addCustomPathPrefix,
  getCustomPathsFromBindings,
  matchesBindingPath,
} from '../../../src/utils/localization/customPaths'

vi.mock('../../../discovery.config.js', async () => {
  const original = await vi.importActual('../../../discovery.config.js')
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

describe('customPaths', () => {
  describe('getCustomPathsFromBindings', () => {
    it('returns an array', () => {
      const paths = getCustomPathsFromBindings()
      expect(Array.isArray(paths)).toBe(true)
    })

    it('returns paths sorted by length (longest first)', () => {
      const paths = getCustomPathsFromBindings()

      expect(paths.length).toBeGreaterThan(1)
      for (let i = 0; i < paths.length - 1; i++) {
        expect(paths[i].path.length).toBeGreaterThanOrEqual(
          paths[i + 1].path.length
        )
      }
    })

    it('returns paths with locale and optional hostname', () => {
      const paths = getCustomPathsFromBindings()

      paths.forEach((pathInfo) => {
        expect(pathInfo).toHaveProperty('path')
        expect(pathInfo).toHaveProperty('locale')
        expect(typeof pathInfo.path).toBe('string')
        expect(typeof pathInfo.locale).toBe('string')
        if (pathInfo.hostname != null) {
          expect(typeof pathInfo.hostname).toBe('string')
        }
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

      expect(result).toBe('/europe/it/apparel')
    })

    it('returns link as-is when current path has no custom prefix', () => {
      const link = '/apparel'
      const currentPath = '/pt-BR/apparel'

      const result = addCustomPathPrefix(link, currentPath)

      expect(result).toBe(link)
    })

    describe('query and hash handling', () => {
      it('preserves query string when adding prefix', () => {
        const link = '/apparel?color=red'
        const currentPath = '/europe/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/europe/it/apparel?color=red')
      })

      it('preserves hash when adding prefix', () => {
        const link = '/apparel#section'
        const currentPath = '/europe/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/europe/it/apparel#section')
      })

      it('preserves query and hash when adding prefix', () => {
        const link = '/apparel?sort=price#reviews'
        const currentPath = '/europe/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/europe/it/apparel?sort=price#reviews')
      })

      it('does not double-prefix when link already has prefix with query', () => {
        const link = '/europe/it/apparel?color=red'
        const currentPath = '/europe/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/europe/it/apparel?color=red')
      })

      it('detects existing prefix when path has query (e.g. /europe/it?foo=bar)', () => {
        const link = '/europe/it?foo=bar'
        const currentPath = '/europe/it/sporting'
        const result = addCustomPathPrefix(link, currentPath)

        expect(result).toBe('/europe/it?foo=bar')
      })
    })

    it('handles root path correctly', () => {
      const link = '/'
      const currentPath = '/europe/it/apparel'

      const result = addCustomPathPrefix(link, currentPath)

      expect(result).toBe('/europe/it/')
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

    describe('when link already has custom path prefix', () => {
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

describe('matchesBindingPath', () => {
  it('should match exact root path', () => {
    expect(matchesBindingPath('/', '/')).toBe(true)
  })

  it('should not match non-root when binding is root', () => {
    expect(matchesBindingPath('/pt-BR', '/')).toBe(false)
    expect(matchesBindingPath('/europe/it', '/')).toBe(false)
  })

  it('should match exact locale path', () => {
    expect(matchesBindingPath('/pt-BR', '/pt-BR')).toBe(true)
    expect(matchesBindingPath('/it-IT', '/it-IT')).toBe(true)
    expect(matchesBindingPath('/en-US', '/en-US')).toBe(true)
  })

  it('should match locale path with trailing slash', () => {
    expect(matchesBindingPath('/pt-BR/', '/pt-BR')).toBe(true)
    expect(matchesBindingPath('/pt-BR', '/pt-BR/')).toBe(true)
    expect(matchesBindingPath('/pt-BR/', '/pt-BR/')).toBe(true)
  })

  it('should match locale path with additional segments', () => {
    expect(matchesBindingPath('/pt-BR/products', '/pt-BR')).toBe(true)
    expect(matchesBindingPath('/pt-BR/office', '/pt-BR')).toBe(true)
    expect(matchesBindingPath('/pt-BR/p', '/pt-BR')).toBe(true)
    expect(matchesBindingPath('/it-IT/apparel', '/it-IT')).toBe(true)
  })

  it('should not match different locale paths', () => {
    expect(matchesBindingPath('/pt-BR', '/it-IT')).toBe(false)
    expect(matchesBindingPath('/en-US', '/pt-BR')).toBe(false)
  })

  it('should match exact custom path', () => {
    expect(matchesBindingPath('/europe/it', '/europe/it')).toBe(true)
    expect(matchesBindingPath('/america/fr', '/america/fr')).toBe(true)
    expect(matchesBindingPath('/emea-eur', '/emea-eur')).toBe(true)
  })

  it('should match custom path with trailing slash', () => {
    expect(matchesBindingPath('/europe/it/', '/europe/it')).toBe(true)
    expect(matchesBindingPath('/europe/it', '/europe/it/')).toBe(true)
  })

  it('should match custom path with additional segments', () => {
    expect(matchesBindingPath('/europe/it/products', '/europe/it')).toBe(true)
    expect(matchesBindingPath('/europe/it/office', '/europe/it')).toBe(true)
    expect(matchesBindingPath('/america/fr/apparel', '/america/fr')).toBe(true)
    expect(matchesBindingPath('/emea-eur/products', '/emea-eur')).toBe(true)
  })

  it('should not match different custom paths', () => {
    expect(matchesBindingPath('/europe/it', '/europe/fr')).toBe(false)
    expect(matchesBindingPath('/europe/it', '/america/it')).toBe(false)
  })

  it('should not match similar but different paths', () => {
    // Important: /europe/item should NOT match /europe/it
    expect(matchesBindingPath('/europe/item', '/europe/it')).toBe(false)
    expect(matchesBindingPath('/europe/italy', '/europe/it')).toBe(false)
  })
})
