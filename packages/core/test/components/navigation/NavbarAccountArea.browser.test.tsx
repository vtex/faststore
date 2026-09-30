/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock(
  '../../../src/components/account/Drawer/OrganizationSignInButton',
  () => ({
    OrganizationSignInButton: ({
      icon,
      isRepresentative,
    }: {
      icon: { alt: string; icon: string }
      isRepresentative?: boolean
    }) => (
      <button
        type="button"
        data-testid="organization-signin"
        data-icon={icon.alt}
      >
        {isRepresentative ? 'Representative' : 'Not representative'}
      </button>
    ),
  })
)

import { NavbarAccountArea } from '../../../src/components/navigation/Navbar/NavbarAccountArea'

const signInButton = {
  icon: { alt: 'account', icon: 'User' },
  label: 'Sign in',
  myAccountLabel: 'My Account',
}

const ButtonSignInStub = {
  Component: ({ label }: { label: string }) => (
    <button type="button" data-testid="storefront-signin">
      {label}
    </button>
  ),
  props: undefined,
}

describe('NavbarAccountArea', () => {
  it('renders the loading skeleton with the Navbar attribute while sign-in is not resolved', () => {
    const { container } = render(
      <NavbarAccountArea
        isSignInResolved={false}
        isOrganizationEnabled={false}
        signInButton={signInButton}
        ButtonSignIn={ButtonSignInStub}
        skeletonAttr="data-fs-navbar-signin-skeleton"
      />
    )

    expect(
      container.querySelector('[data-fs-navbar-signin-skeleton]')
    ).toBeTruthy()
    expect(
      container.querySelector('[data-fs-navbar-slider-signin-skeleton]')
    ).toBeNull()
  })

  it('renders the loading skeleton with the NavbarSlider attribute while sign-in is not resolved', () => {
    const { container } = render(
      <NavbarAccountArea
        isSignInResolved={false}
        isOrganizationEnabled={false}
        signInButton={signInButton}
        ButtonSignIn={ButtonSignInStub}
        skeletonAttr="data-fs-navbar-slider-signin-skeleton"
      />
    )

    expect(
      container.querySelector('[data-fs-navbar-slider-signin-skeleton]')
    ).toBeTruthy()
  })

  it('renders the OrganizationSignInButton when the organization area is enabled', () => {
    render(
      <NavbarAccountArea
        isSignInResolved
        isOrganizationEnabled
        isRepresentative
        signInButton={signInButton}
        ButtonSignIn={ButtonSignInStub}
        skeletonAttr="data-fs-navbar-signin-skeleton"
      />
    )

    expect(screen.getByTestId('organization-signin')).toHaveTextContent(
      'Representative'
    )
    expect(screen.queryByTestId('storefront-signin')).toBeNull()
  })

  it('renders the storefront ButtonSignIn override when the organization area is not enabled', () => {
    render(
      <NavbarAccountArea
        isSignInResolved
        isOrganizationEnabled={false}
        signInButton={signInButton}
        ButtonSignIn={ButtonSignInStub}
        skeletonAttr="data-fs-navbar-signin-skeleton"
      />
    )

    expect(screen.getByTestId('storefront-signin')).toHaveTextContent('Sign in')
    expect(screen.queryByTestId('organization-signin')).toBeNull()
  })
})
