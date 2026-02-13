import { describe, expect, it, vi } from 'vitest'
import { matchURLBinding } from '../../src/sdk/localization/match-url'

vi.mock(import('../../discovery.config.js'), async (original) => ({
  default: {
    ...((await original()).default ?? {}),
    localization: {
      enabled: true,
      defaultLocale: 'pt-BR',
      regions: {
        CA: {
          code: 'CA',
          name: 'Canada',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: '12h',
          timeFormatMask: 'hh:mm a',
          unitSystem: 'metric',
          defaultTimezone: 'GMT-5',
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
        IT: {
          code: 'IT',
          name: 'Italy',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          timeFormatMask: 'HH:mm',
          unitSystem: 'metric',
          defaultTimezone: 'GMT+1',
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
      },
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
        'en-CA': {
          code: 'en-CA',
          name: 'English',
          languageCode: 'en',
          languageName: 'English',
          script: 'Latn',
          textDirection: 'ltr',
          regionCode: 'CA',
          bindings: [
            {
              currencyCode: 'BRL',
              url: 'https://brandless.fast.store/pt-BR',
              salesChannel: '1',
              isDefault: true,
            },
            {
              currencyCode: 'USD',
              url: 'https://brandless.fast.store/en-CA',
              salesChannel: '2',
              isDefault: false,
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
              url: 'https://brandless.fast.store/america/fr',
              salesChannel: '4',
              isDefault: false,
            },
          ],
        },
        'en-GB': {
          code: 'en-GB',
          name: 'English',
          languageCode: 'en',
          languageName: 'English',
          script: 'Latn',
          textDirection: 'ltr',
          regionCode: 'GB',
          bindings: [
            {
              currencyCode: 'EUR',
              url: 'https://brandless.fast.store/emea-eur',
              salesChannel: '5',
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
              salesChannel: '2',
              isDefault: false,
            },
          ],
        },
      },
      currencies: {
        BRL: {
          code: 'BRL',
          name: 'Brazilian Real',
          symbol: 'R$',
        },
        USD: {
          code: 'USD',
          name: 'US Dollar',
          symbol: '$',
        },
        EUR: {
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
        },
        CAD: {
          code: 'CAD',
          name: 'Canadian Dollar',
          symbol: '$',
        },
      },
    },
  },
}))

import config from 'discovery.config'

describe('URL match', () => {
  describe('Root domain bindings', () => {
    it('should match root domain without path', () => {
      const ptBR = {
        config: config.localization['locales']['pt-BR'],
        binding: {
          currencyCode: 'BRL',
          url: 'https://brandless.myvtex.com',
          salesChannel: '1',
          isDefault: true,
        },
      }

      expect(matchURLBinding('https://brandless.myvtex.com')).toEqual(ptBR)
      expect(matchURLBinding('https://brandless.myvtex.com:3000')).toEqual(ptBR)
      expect(
        matchURLBinding('https://brandless.myvtex.com?test=123&v=2')
      ).toEqual(ptBR)
    })
  })

  describe('Locale path bindings', () => {
    it('should match locale paths like /en-CA', () => {
      const enCa = {
        config: config.localization['locales']['en-CA'],
        binding: {
          currencyCode: 'USD',
          url: 'https://brandless.fast.store/en-CA',
          salesChannel: '2',
          isDefault: false,
        },
      }

      expect(
        matchURLBinding('https://brandless.fast.store:3000/en-CA')
      ).toEqual(enCa)
      expect(matchURLBinding('https://brandless.fast.store/en-CA')).toEqual(
        enCa
      )
      expect(
        matchURLBinding('https://brandless.fast.store/en-CA?test=1')
      ).toEqual(enCa)
    })

    it('should match locale paths like /it-IT', () => {
      const itIT = {
        config: config.localization['locales']['it-IT'],
        binding: {
          currencyCode: 'USD',
          url: 'https://brandless.fast.store/it-IT',
          salesChannel: '2',
          isDefault: false,
        },
      }

      expect(matchURLBinding('https://brandless.fast.store/it-IT')).toEqual(
        itIT
      )
    })

    it('should match locale paths with additional path segments', () => {
      const enCa = {
        config: config.localization['locales']['en-CA'],
        binding: {
          currencyCode: 'BRL',
          url: 'https://brandless.fast.store/pt-BR',
          salesChannel: '1',
          isDefault: true,
        },
      }

      // Should match even with additional path segments after the locale path
      expect(
        matchURLBinding('https://brandless.fast.store/pt-BR/products')
      ).toEqual(enCa)
      expect(
        matchURLBinding('https://brandless.fast.store/pt-BR/office')
      ).toEqual(enCa)
      expect(
        matchURLBinding('https://brandless.fast.store/pt-BR/p?id=123')
      ).toEqual(enCa)
    })
  })

  describe('Custom path bindings', () => {
    it('should match custom path /europe/it', () => {
      const europeIt = {
        config: config.localization['locales']['it-IT'],
        binding: {
          currencyCode: 'EUR',
          url: 'https://brandless.fast.store/europe/it',
          salesChannel: '3',
          isDefault: false,
        },
      }

      expect(matchURLBinding('https://brandless.fast.store/europe/it')).toEqual(
        europeIt
      )
      expect(
        matchURLBinding('https://brandless.fast.store/europe/it?q=test')
      ).toEqual(europeIt)
    })

    it('should match custom path /america/fr', () => {
      const americaFr = {
        config: config.localization['locales']['fr-CA'],
        binding: {
          currencyCode: 'CAD',
          url: 'https://brandless.fast.store/america/fr',
          salesChannel: '4',
          isDefault: false,
        },
      }

      expect(
        matchURLBinding('https://brandless.fast.store/america/fr')
      ).toEqual(americaFr)
    })

    it('should match custom path /emea-eur', () => {
      const emeaEur = {
        config: config.localization['locales']['en-GB'],
        binding: {
          currencyCode: 'EUR',
          url: 'https://brandless.fast.store/emea-eur',
          salesChannel: '5',
          isDefault: false,
        },
      }

      expect(matchURLBinding('https://brandless.fast.store/emea-eur')).toEqual(
        emeaEur
      )
    })

    it('should match custom path with additional path segments', () => {
      const europeIt = {
        config: config.localization['locales']['it-IT'],
        binding: {
          currencyCode: 'EUR',
          url: 'https://brandless.fast.store/europe/it',
          salesChannel: '3',
          isDefault: false,
        },
      }

      // Should match even with additional path segments after the binding path
      expect(
        matchURLBinding('https://brandless.fast.store/europe/it/products')
      ).toEqual(europeIt)
      expect(
        matchURLBinding('https://brandless.fast.store/europe/it/office')
      ).toEqual(europeIt)
      expect(
        matchURLBinding('https://brandless.fast.store/europe/it/p?id=123')
      ).toEqual(europeIt)
    })
  })

  describe('Path normalization', () => {
    it('should handle trailing slashes correctly', () => {
      const enCa = {
        config: config.localization['locales']['en-CA'],
        binding: {
          currencyCode: 'BRL',
          url: 'https://brandless.fast.store/pt-BR',
          salesChannel: '1',
          isDefault: true,
        },
      }

      // With and without trailing slash should match
      expect(matchURLBinding('https://brandless.fast.store/pt-BR/')).toEqual(
        enCa
      )
      expect(matchURLBinding('https://brandless.fast.store/pt-BR')).toEqual(
        enCa
      )
    })

    it('should handle root path variations', () => {
      const ptBR = {
        config: config.localization['locales']['pt-BR'],
        binding: {
          currencyCode: 'BRL',
          url: 'https://brandless.myvtex.com',
          salesChannel: '1',
          isDefault: true,
        },
      }

      expect(matchURLBinding('https://brandless.myvtex.com/')).toEqual(ptBR)
      expect(matchURLBinding('https://brandless.myvtex.com')).toEqual(ptBR)
    })
  })
})
