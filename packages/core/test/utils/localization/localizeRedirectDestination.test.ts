import { describe, expect, it, vi } from 'vitest'

const mockStoreConfig = vi.hoisted(() => ({
  localization: {
    enabled: true,
    defaultLocale: 'en-US',
    locales: {
      'en-US': {
        code: 'en-US',
        bindings: [
          {
            url: 'https://brandless.fast.store/en-US',
            salesChannel: '1',
            isDefault: true,
          },
        ],
      },
      'it-IT': {
        code: 'it-IT',
        bindings: [
          {
            url: 'https://brandless.fast.store/it-IT',
            salesChannel: '1',
            isDefault: true,
          },
          {
            url: 'https://brandless.fast.store/europe/it',
            salesChannel: '1',
            isDefault: false,
          },
        ],
      },
      'en-GB': {
        code: 'en-GB',
        bindings: [
          {
            url: 'https://brandless.fast.store/emea-eur',
            salesChannel: '1',
            isDefault: true,
          },
        ],
      },
    },
  },
}))

vi.mock('../../../discovery.config.js', () => ({
  default: mockStoreConfig,
}))

import { localizeRedirectDestination } from '../../../src/utils/localization/localizeRedirectDestination'

const PROFILE = '/pvt/account/profile'
const ORDERS = '/pvt/account/orders'

describe('localizeRedirectDestination', () => {
  describe('when localization is disabled', () => {
    it('returns the destination unchanged', () => {
      mockStoreConfig.localization.enabled = false

      expect(
        localizeRedirectDestination(PROFILE, {
          locale: 'it-IT',
          defaultLocale: 'en-US',
          req: { url: '/europe/it/pvt/account' },
        })
      ).toBe(PROFILE)

      mockStoreConfig.localization.enabled = true
    })
  })

  describe('non-internal destinations', () => {
    it('leaves external URLs unchanged', () => {
      expect(
        localizeRedirectDestination('https://example.com/account', {
          locale: 'it-IT',
          defaultLocale: 'en-US',
        })
      ).toBe('https://example.com/account')
    })

    it('leaves protocol-relative URLs unchanged', () => {
      expect(
        localizeRedirectDestination('//cdn.example.com/path', {
          locale: 'it-IT',
          defaultLocale: 'en-US',
        })
      ).toBe('//cdn.example.com/path')
    })
  })

  describe('custom binding paths (mirrors resolveLink + addCustomPathPrefix)', () => {
    it('preserves /emea-eur when the request arrived on that vanity path', () => {
      expect(
        localizeRedirectDestination(PROFILE, {
          locale: 'en-GB',
          defaultLocale: 'en-US',
          req: { url: '/emea-eur/pvt/account' },
        })
      ).toBe('/emea-eur/pvt/account/profile')
    })

    it('preserves /europe/it when the request arrived on that vanity path', () => {
      expect(
        localizeRedirectDestination(ORDERS, {
          locale: 'it-IT',
          defaultLocale: 'en-US',
          req: { url: '/europe/it/pvt/account/profile' },
        })
      ).toBe('/europe/it/pvt/account/orders')
    })

    it('keeps query strings on the destination', () => {
      expect(
        localizeRedirectDestination('/pvt/account/403?from=%2Fpvt%2Faccount', {
          locale: 'en-GB',
          defaultLocale: 'en-US',
          req: { url: '/emea-eur/pvt/account/profile' },
        })
      ).toBe('/emea-eur/pvt/account/403?from=%2Fpvt%2Faccount')
    })
  })

  describe('Next.js locale-code paths', () => {
    it('prepends /it-IT when locale is non-default and req.url has no custom prefix', () => {
      expect(
        localizeRedirectDestination(PROFILE, {
          locale: 'it-IT',
          defaultLocale: 'en-US',
          req: { url: '/pvt/account' },
        })
      ).toBe('/it-IT/pvt/account/profile')
    })

    it('does not double-prefix when destination already includes the locale', () => {
      expect(
        localizeRedirectDestination('/it-IT/pvt/account/profile', {
          locale: 'it-IT',
          defaultLocale: 'en-US',
          req: { url: '/pvt/account' },
        })
      ).toBe('/it-IT/pvt/account/profile')
    })
  })

  describe('default locale and missing request context', () => {
    it('returns destination unchanged for the default locale', () => {
      expect(
        localizeRedirectDestination(PROFILE, {
          locale: 'en-US',
          defaultLocale: 'en-US',
          req: { url: '/pvt/account' },
        })
      ).toBe(PROFILE)
    })

    it('falls back to locale prefix when req is absent (getStaticProps)', () => {
      expect(
        localizeRedirectDestination('/pvt/account/404', {
          locale: 'it-IT',
          defaultLocale: 'en-US',
        })
      ).toBe('/it-IT/pvt/account/404')
    })

    it('returns destination unchanged when req is absent and locale is default', () => {
      expect(
        localizeRedirectDestination('/pvt/account/404', {
          locale: 'en-US',
          defaultLocale: 'en-US',
        })
      ).toBe('/pvt/account/404')
    })
  })
})
