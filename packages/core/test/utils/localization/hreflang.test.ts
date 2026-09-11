import { describe, expect, it, vi } from 'vitest'
import { buildHreflangLinks } from '../../../src/utils/localization/hreflang.js'

vi.mock(import('../../../discovery.config.js'), async (original) => ({
  default: {
    ...((await original()).default ?? {}),
    localization: {
      enabled: true,
      defaultLocale: 'en-US',
      regions: {},
      locales: {
        'en-US': {
          code: 'en-US',
          bindings: [
            {
              currencyCode: 'USD',
              // The default locale is served under a prefix, not at the root.
              url: 'https://brandless.fast.store/en-US',
              salesChannel: '1',
              isDefault: true,
            },
          ],
        },
        'pt-BR': {
          code: 'pt-BR',
          bindings: [
            {
              currencyCode: 'BRL',
              url: 'https://brandless.fast.store/pt-BR',
              salesChannel: '2',
              isDefault: true,
            },
          ],
        },
        'it-IT': {
          code: 'it-IT',
          bindings: [
            {
              currencyCode: 'USD',
              // Bindings are arbitrary paths, not locale codes.
              url: 'https://brandless.fast.store/europe/it',
              salesChannel: '1',
              isDefault: true,
            },
          ],
        },
      },
      currencies: {
        USD: { code: 'USD', name: 'US Dollar', symbol: '$' },
        BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
      },
    },
  },
}))

const OTHER_LOCALES = [
  { locale: 'en-US', slug: 'eletronicos' },
  { locale: 'pt-BR', slug: 'eletronicos' },
  { locale: 'it-IT', slug: 'elettronica' },
]

describe('buildHreflangLinks', () => {
  it('points each locale at its own binding', () => {
    const links = buildHreflangLinks(OTHER_LOCALES, 'en-US')

    expect(links).toContainEqual({
      hrefLang: 'pt-BR',
      href: 'https://brandless.fast.store/pt-BR/eletronicos',
    })
    expect(links).toContainEqual({
      hrefLang: 'it-IT',
      href: 'https://brandless.fast.store/europe/it/elettronica',
    })
  })

  // A cluster that does not reference itself is ignored by search engines.
  it('includes the rendered locale itself', () => {
    const links = buildHreflangLinks(OTHER_LOCALES, 'en-US')

    expect(links).toContainEqual({
      hrefLang: 'en-US',
      href: 'https://brandless.fast.store/en-US/eletronicos',
    })
  })

  // The store root answers too, but it canonicalizes elsewhere, so pointing
  // x-default at it would send the cluster to a page that disclaims itself.
  it('derives x-default from the default locale binding, not the store root', () => {
    const links = buildHreflangLinks(OTHER_LOCALES, 'en-US')

    expect(links).toContainEqual({
      hrefLang: 'x-default',
      href: 'https://brandless.fast.store/en-US/eletronicos',
    })
  })

  it('appends the product suffix when given one', () => {
    const links = buildHreflangLinks(
      [{ locale: 'pt-BR', slug: 'camisa-12' }],
      'pt-BR',
      '/p'
    )

    expect(links).toContainEqual({
      hrefLang: 'pt-BR',
      href: 'https://brandless.fast.store/pt-BR/camisa-12/p',
    })
  })

  it('omits x-default when the default locale has no slug registered', () => {
    const links = buildHreflangLinks(
      [{ locale: 'pt-BR', slug: 'eletronicos' }],
      'pt-BR'
    )

    expect(links.some(({ hrefLang }) => hrefLang === 'x-default')).toBe(false)
  })

  // The catalog resolves the page in it-IT by falling back to another locale's
  // slug, so the shopper sees it, but it-IT registered no translation and is
  // therefore missing from the cluster it would be annotating.
  it('annotates nothing when the rendered locale is not in the cluster', () => {
    const links = buildHreflangLinks(
      [
        { locale: 'en-US', slug: 'eletronicos' },
        { locale: 'pt-BR', slug: 'eletronicos' },
      ],
      'it-IT'
    )

    expect(links).toEqual([])
  })

  // Next only leaves the locale undefined when i18n is off, which means the
  // store has a single locale and it is the default one.
  it('falls back to the default locale when Next reports none', () => {
    const links = buildHreflangLinks(OTHER_LOCALES, undefined)

    expect(links).toContainEqual({
      hrefLang: 'en-US',
      href: 'https://brandless.fast.store/en-US/eletronicos',
    })
  })

  it('annotates nothing when there are no alternates', () => {
    expect(buildHreflangLinks(null, 'en-US')).toEqual([])
    expect(buildHreflangLinks([], 'en-US')).toEqual([])
  })
})
