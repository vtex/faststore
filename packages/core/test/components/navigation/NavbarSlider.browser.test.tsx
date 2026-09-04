/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
const mockNavbarAccountArea = vi.hoisted(() => vi.fn())
const mockStoreConfig = vi.hoisted(() => ({
  experimental: { enableFaststoreMyAccount: false },
  localization: { enabled: false },
}))

vi.mock('@faststore/ui', () => ({
  useFadeEffect: () => ({ fade: 'in', fadeOut: vi.fn() }),
  useUI: () => ({ closeNavbar: vi.fn() }),
}))

vi.mock('discovery.config', () => ({ default: mockStoreConfig }))

vi.mock('src/components/navigation/NavbarLinks', () => ({
  default: () => <nav data-testid="navbar-links" />,
}))

vi.mock('src/components/ui/Button', () => ({
  ButtonSignInFallback: () => null,
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
    NavbarSlider: {
      Component: ({ children }: React.PropsWithChildren) => (
        <div data-testid="navbar-slider-wrapper">{children}</div>
      ),
      props: {},
    },
    NavbarSliderHeader: {
      Component: ({ children }: React.PropsWithChildren) => (
        <header>{children}</header>
      ),
      props: {},
    },
    NavbarSliderContent: {
      Component: ({ children }: React.PropsWithChildren) => (
        <div>{children}</div>
      ),
      props: {},
    },
    NavbarSliderFooter: {
      Component: ({ children }: React.PropsWithChildren) => (
        <footer>{children}</footer>
      ),
      props: {},
    },
    _experimentalButtonSignIn: { Component: () => null },
  }),
}))

vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

import NavbarSlider from '../../../src/components/navigation/NavbarSlider/NavbarSlider'

const baseProps = {
  logo: {
    src: '/logo.png',
    alt: 'Logo',
    link: { url: '/', title: 'Home' },
  },
  home: { label: 'Home' },
  links: [],
  region: { icon: 'MapPin', label: 'Region', shouldDisplayRegion: false },
  signIn: {
    button: {
      icon: { alt: 'account', icon: 'User' },
      label: 'Sign in',
      myAccountLabel: 'My Account',
    },
  },
}

describe('NavbarSlider', () => {
  it('resolves the sign-in area and forwards isSignInResolved=false while the session has not validated', () => {
    mockUseSession.mockReturnValue({
      b2b: {},
      isSessionReady: false,
      hasValidated: false,
    })

    render(<NavbarSlider {...baseProps} />)

    expect(screen.getByTestId('navbar-account-area')).toBeTruthy()
    expect(mockNavbarAccountArea).toHaveBeenCalledWith(
      expect.objectContaining({
        isSignInResolved: false,
        skeletonAttr: 'data-fs-navbar-slider-signin-skeleton',
      })
    )
  })

  it('forwards isSignInResolved=true and isOrganizationEnabled once the B2B representative session resolves', () => {
    mockStoreConfig.experimental.enableFaststoreMyAccount = true
    mockUseSession.mockReturnValue({
      b2b: { isRepresentative: true },
      isSessionReady: true,
      hasValidated: true,
    })

    render(<NavbarSlider {...baseProps} />)

    expect(mockNavbarAccountArea).toHaveBeenCalledWith(
      expect.objectContaining({
        isSignInResolved: true,
        isOrganizationEnabled: true,
        isRepresentative: true,
      })
    )

    mockStoreConfig.experimental.enableFaststoreMyAccount = false
  })
})
