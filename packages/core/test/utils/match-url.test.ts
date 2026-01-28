import { vi } from 'vitest'
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
      },
    },
  },
}))

import config from 'discovery.config'

describe('URL match', () => {
  it('Should pass', () => {
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

    const enCa = {
      config: config.localization['locales']['en-CA'],
      binding: {
        currencyCode: 'BRL',
        url: 'https://brandless.fast.store/pt-BR',
        salesChannel: '1',
        isDefault: true,
      },
    }
    expect(matchURLBinding('https://brandless.fast.store:3000/pt-BR')).toEqual(
      enCa
    )
    expect(matchURLBinding('https://brandless.fast.store/pt-BR')).toEqual(enCa)
    expect(matchURLBinding('https://brandless.fast.store/pt-BR?q=123')).toEqual(
      enCa
    )
  })
})
