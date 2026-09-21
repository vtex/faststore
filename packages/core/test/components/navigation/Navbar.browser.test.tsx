/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { forwardRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
const mockUseScreenResize = vi.hoisted(() => vi.fn())
const mockNavbarAccountArea = vi.hoisted(() => vi.fn())
const mockStoreConfig = vi.hoisted(() => ({
  experimental: { enableFaststoreMyAccount: false },
  localization: { enabled: false },
}))

vi.mock('next/dynamic', () => ({
  default: () => () => null,
}))

vi.mock('@faststore/ui', () => ({
  Icon: () => null,
  Skeleton: () => null,
  useScrollDirection: () => 'up',
  useUI: () => ({ openNavbar: vi.fn(), navbar: false }),
}))

vi.mock('discovery.config', () => ({ default: mockStoreConfig }))

vi.mock('src/components/account/Drawer/OrganizationSignInButton', () => ({
  OrganizationSignInButton: () => null,
}))

vi.mock('src/components/cart/CartToggle', () => ({
  default: () => <div data-testid="cart-toggle" />,
}))

vi.mock('src/components/search/SearchInput', () => ({
  default: forwardRef(function SearchInputStub(_props, _ref) {
    return <div data-testid="search-input" />
  }),
}))

vi.mock('src/components/ui/Link', () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <a href="/">{children}</a>
  ),
}))

vi.mock('src/components/ui/LocalizationButton', () => ({
  default: () => <div data-testid="localization-button" />,
}))

vi.mock('src/components/ui/Logo', () => ({
  default: () => <div data-testid="logo" />,
}))

vi.mock('../../../src/components/navigation/Navbar/NavbarAccountArea', () => ({
  NavbarAccountArea: (props: Record<string, unknown>) => {
    mockNavbarAccountArea(props)
    return <div data-testid="navbar-account-area" />
  },
}))

vi.mock('src/sdk/overrides/OverrideContext', () => ({
  useOverrideComponents: () => ({
    Navbar: {
      Component: ({ children }: React.PropsWithChildren) => (
        <div data-testid="navbar-wrapper">{children}</div>
      ),
      props: {},
    },
    NavbarHeader: {
      Component: ({ children }: React.PropsWithChildren) => (
        <header>{children}</header>
      ),
      props: {},
    },
    NavbarRow: {
      Component: ({ children }: React.PropsWithChildren) => (
        <div>{children}</div>
      ),
      props: {},
    },
    NavbarButtons: {
      Component: ({ children }: React.PropsWithChildren) => (
        <div>{children}</div>
      ),
      props: {},
    },
    IconButton: {
      Component: (props: Record<string, unknown>) => <button {...props} />,
      props: { 'aria-label': 'menu' },
    },
    _experimentalButtonSignIn: { Component: () => null },
  }),
}))

vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

vi.mock('src/sdk/ui/useScreenResize', () => ({
  default: mockUseScreenResize,
}))

import Navbar from '../../../src/components/navigation/Navbar/Navbar'

const baseProps = {
  logo: {
    src: '/logo.png',
    alt: 'Logo',
    link: { url: '/', title: 'Home' },
  },
  searchInput: { sort: 'score_desc' },
  cart: { alt: 'cart', icon: 'ShoppingCart' },
  signIn: {
    button: {
      icon: { alt: 'account', icon: 'User' },
      label: 'Sign in',
      myAccountLabel: 'My Account',
    },
  },
  region: { icon: 'MapPin', label: 'Region', shouldDisplayRegion: false },
  links: [],
  home: { label: 'Home' },
  menu: { icon: { icon: 'List', alt: 'Menu' } },
}

describe('Navbar', () => {
  it('renders the account area (desktop) and forwards isSignInResolved=false before the session validates', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: true })
    mockUseSession.mockReturnValue({
      b2b: {},
      isSessionReady: false,
      hasValidated: false,
    })

    render(<Navbar {...baseProps} />)

    expect(screen.getByTestId('navbar-account-area')).toBeTruthy()
    expect(mockNavbarAccountArea).toHaveBeenCalledWith(
      expect.objectContaining({
        isSignInResolved: false,
        skeletonAttr: 'data-fs-navbar-signin-skeleton',
      })
    )
  })

  it('forwards isSignInResolved=true and isOrganizationEnabled for a resolved B2B representative session', () => {
    mockStoreConfig.experimental.enableFaststoreMyAccount = true
    mockUseScreenResize.mockReturnValue({ isDesktop: true })
    mockUseSession.mockReturnValue({
      b2b: { isRepresentative: true },
      isSessionReady: true,
      hasValidated: true,
    })

    render(<Navbar {...baseProps} />)

    expect(mockNavbarAccountArea).toHaveBeenCalledWith(
      expect.objectContaining({
        isSignInResolved: true,
        isOrganizationEnabled: true,
        isRepresentative: true,
      })
    )

    mockStoreConfig.experimental.enableFaststoreMyAccount = false
  })

  it('does not render the account area on mobile', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: false })
    mockUseSession.mockReturnValue({
      b2b: {},
      isSessionReady: true,
      hasValidated: true,
    })

    render(<Navbar {...baseProps} />)

    expect(screen.queryByTestId('navbar-account-area')).toBeNull()
  })
})
