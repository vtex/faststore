import { describe, expect, it, vi } from 'vitest'
import { getStoreURL } from '../../../src/sdk/localization/useLocalizationConfig.js'

vi.mock(import('../../../discovery.config.js'), async (original) => ({
  default: {
    ...((await original()).default ?? {}),
    localization: {
      enabled: true,
      defaultLocale: 'pt-BR',
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
            {
              currencyCode: 'BRL',
              url: 'https://brandless.fast.store/pt-BR',
              salesChannel: '1',
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

import config from '../../../discovery.config'

describe('localization store url', () => {
  it('should return correct binding', () => {
    expect(getStoreURL()).toEqual(
      config.localization.locales['pt-BR'].bindings[0].url
    )
  })

  // Static rendering has no window.location to match a binding against, so
  // without a locale every page describes itself with the default locale's URL.
  it('returns the requested locale binding instead of the default one', () => {
    expect(getStoreURL('en-US')).toEqual('https://brandless.fast.store/en-US')
  })

  it('prefers the binding marked default over declaration order', () => {
    expect(getStoreURL('pt-BR')).toEqual('https://brandless.myvtex.com')
  })

  it('falls back to the default locale for a locale that is not configured', () => {
    expect(getStoreURL('fr-FR')).toEqual(
      config.localization.locales['pt-BR'].bindings[0].url
    )
  })
})
