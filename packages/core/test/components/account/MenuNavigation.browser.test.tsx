/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockPrefetch = vi.hoisted(() => vi.fn())
const mockRouter = vi.hoisted(() => ({
  pathname: '/pvt/account/profile',
  asPath: '/pvt/account/profile',
  locale: 'en-US',
  defaultLocale: 'en-US',
  prefetch: vi.fn(),
}))

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: {
    localization: {
      enabled: true,
      defaultLocale: 'en-US',
      locales: {
        'en-US': { bindings: [] },
        'fr-CA': { bindings: [] },
        'en-GB': { bindings: [{ url: 'https://store.test/europe/uk' }] },
      },
    },
  },
}))

vi.mock('src/sdk/session', () => ({ useSession: () => ({ b2b: undefined }) }))

vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountNavigationLabels: () => ({ switchLabel: 'Switch' }),
}))

vi.mock('src/sdk/ui/useScreenResize', () => ({
  default: () => ({ isDesktop: true }),
}))

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}))

vi.mock('next/link', () => ({
  __esModule: true,
  default: () => {
    throw new Error('My Account navigation must not render next/link')
  },
}))

import Menu from '../../../src/components/account/Menu/Menu'

const items = [
  { title: 'Profile', route: '/pvt/account/profile' },
  { title: 'Orders', route: '/pvt/account/orders' },
  { title: 'Security', route: '/pvt/account/security' },
]

describe('Menu navigation links', () => {
  beforeEach(() => {
    mockRouter.pathname = '/pvt/account/profile'
    mockRouter.asPath = '/pvt/account/profile'
    mockRouter.locale = 'en-US'
    mockRouter.prefetch = mockPrefetch
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders every item as a plain anchor with its route as href', () => {
    render(<Menu accountName="Jane" items={items} />)

    for (const { title, route } of items) {
      const link = screen.getByRole('link', { name: title })

      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', route)
    }
  })

  it('keeps the selected state based on the current pathname', () => {
    render(<Menu accountName="Jane" items={items} />)

    const selected = (title: string) =>
      screen.getByRole('link', { name: title }).closest('li')

    expect(selected('Profile')).toHaveAttribute('data-is-selected', 'true')
    expect(selected('Orders')).toHaveAttribute('data-is-selected', 'false')
  })

  it('does not prefetch on hover, touch or focus', () => {
    render(<Menu accountName="Jane" items={items} />)

    for (const { title } of items) {
      const link = screen.getByRole('link', { name: title })

      fireEvent.mouseEnter(link)
      fireEvent.mouseOver(link)
      fireEvent.touchStart(link)
      fireEvent.focus(link)
    }

    expect(mockPrefetch).not.toHaveBeenCalled()
  })

  it('keeps the non-default locale prefix in the href', () => {
    mockRouter.locale = 'fr-CA'
    mockRouter.asPath = '/fr-CA/pvt/account/profile'

    render(<Menu accountName="Jane" items={items} />)

    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute(
      'href',
      '/fr-CA/pvt/account/orders'
    )
    expect(screen.getByRole('link', { name: 'Security' })).toHaveAttribute(
      'href',
      '/fr-CA/pvt/account/security'
    )
  })

  it('keeps the custom path prefix in the href', () => {
    mockRouter.locale = 'en-GB'
    mockRouter.asPath = '/europe/uk/pvt/account/profile'

    render(<Menu accountName="Jane" items={items} />)

    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute(
      'href',
      '/europe/uk/pvt/account/orders'
    )
  })

  describe('with extra routes', () => {
    const extraItems = [
      ...items,
      { title: 'Help', route: 'https://example.com/help' },
      { title: 'Store credit', route: '/pvt/custom/store-credit' },
    ]

    it('keeps an external URL untouched, even on a non-default locale', () => {
      mockRouter.locale = 'fr-CA'
      mockRouter.asPath = '/fr-CA/pvt/account/profile'

      render(<Menu accountName="Jane" items={extraItems} />)

      const link = screen.getByRole('link', { name: 'Help' })

      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', 'https://example.com/help')
    })

    it('localizes a custom store route outside /pvt/account', () => {
      mockRouter.locale = 'fr-CA'
      mockRouter.asPath = '/fr-CA/pvt/account/profile'

      render(<Menu accountName="Jane" items={extraItems} />)

      expect(
        screen.getByRole('link', { name: 'Store credit' })
      ).toHaveAttribute('href', '/fr-CA/pvt/custom/store-credit')
    })

    it('does not prefetch extra routes on hover, touch or focus', () => {
      render(<Menu accountName="Jane" items={extraItems} />)

      for (const title of ['Help', 'Store credit']) {
        const link = screen.getByRole('link', { name: title })

        fireEvent.mouseEnter(link)
        fireEvent.mouseOver(link)
        fireEvent.touchStart(link)
        fireEvent.focus(link)
      }

      expect(mockPrefetch).not.toHaveBeenCalled()
    })
  })
})
