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
      isB2BBuyer,
    }: {
      icon: { alt: string; icon: string }
      isB2BBuyer?: boolean
    }) => (
      <button
        type="button"
        data-testid="organization-signin"
        data-icon={icon.alt}
      >
        {isB2BBuyer ? 'B2B buyer' : 'Not a B2B buyer'}
      </button>
    ),
  })
)

vi.mock('../../../src/sdk/ui/useLink', () => ({
  useLink: () => ({ resolveLink: (href: string) => href }),
}))

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
        isB2BBuyer
        signInButton={signInButton}
        ButtonSignIn={ButtonSignInStub}
        skeletonAttr="data-fs-navbar-signin-skeleton"
      />
    )

    expect(screen.getByTestId('organization-signin')).toHaveTextContent(
      'B2B buyer'
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

  describe('Sign up entry', () => {
    const signInWithSignUp = {
      ...signInButton,
      signUp: { enabled: true, label: 'Sign up', url: '/register' },
    }

    it('renders "Sign up" next to "Sign in" for a signed-out visitor', () => {
      render(
        <NavbarAccountArea
          isSignInResolved
          isOrganizationEnabled={false}
          isSignedIn={false}
          signInButton={signInWithSignUp}
          ButtonSignIn={ButtonSignInStub}
          skeletonAttr="data-fs-navbar-signin-skeleton"
        />
      )

      expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
        'href',
        '/register'
      )
      expect(screen.getByTestId('storefront-signin')).toBeInTheDocument()
    })

    it('does not render "Sign up" at all for a signed-in shopper', () => {
      render(
        <NavbarAccountArea
          isSignInResolved
          isOrganizationEnabled={false}
          isSignedIn
          signInButton={signInWithSignUp}
          ButtonSignIn={ButtonSignInStub}
          skeletonAttr="data-fs-navbar-signin-skeleton"
        />
      )

      expect(screen.queryByText('Sign up')).toBeNull()
    })

    it('does not render "Sign up" while the session is unresolved', () => {
      render(
        <NavbarAccountArea
          isSignInResolved={false}
          isOrganizationEnabled={false}
          isSignedIn={false}
          signInButton={signInWithSignUp}
          ButtonSignIn={ButtonSignInStub}
          skeletonAttr="data-fs-navbar-signin-skeleton"
        />
      )

      expect(screen.queryByText('Sign up')).toBeNull()
    })

    it('does not render "Sign up" when it is disabled in the CMS', () => {
      render(
        <NavbarAccountArea
          isSignInResolved
          isOrganizationEnabled={false}
          isSignedIn={false}
          signInButton={{
            ...signInButton,
            signUp: { enabled: false, label: 'Sign up', url: '/register' },
          }}
          ButtonSignIn={ButtonSignInStub}
          skeletonAttr="data-fs-navbar-signin-skeleton"
        />
      )

      expect(screen.queryByText('Sign up')).toBeNull()
      expect(screen.getByTestId('storefront-signin')).toBeInTheDocument()
    })

    it('does not render "Sign up" when "enabled" is absent', () => {
      render(
        <NavbarAccountArea
          isSignInResolved
          isOrganizationEnabled={false}
          isSignedIn={false}
          signInButton={{
            ...signInButton,
            signUp: { label: 'Sign up', url: '/register' },
          }}
          ButtonSignIn={ButtonSignInStub}
          skeletonAttr="data-fs-navbar-signin-skeleton"
        />
      )

      expect(screen.queryByText('Sign up')).toBeNull()
      expect(screen.getByTestId('storefront-signin')).toBeInTheDocument()
    })

    it('renders "Sign up" when it is explicitly enabled in the CMS', () => {
      render(
        <NavbarAccountArea
          isSignInResolved
          isOrganizationEnabled={false}
          isSignedIn={false}
          signInButton={{
            ...signInButton,
            signUp: { enabled: true, label: 'Sign up', url: '/register' },
          }}
          ButtonSignIn={ButtonSignInStub}
          skeletonAttr="data-fs-navbar-signin-skeleton"
        />
      )

      expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument()
    })

    it('does not render "Sign up" when it is not configured', () => {
      render(
        <NavbarAccountArea
          isSignInResolved
          isOrganizationEnabled={false}
          isSignedIn={false}
          signInButton={signInButton}
          ButtonSignIn={ButtonSignInStub}
          skeletonAttr="data-fs-navbar-signin-skeleton"
        />
      )

      expect(screen.queryByText('Sign up')).toBeNull()
    })
  })
})
