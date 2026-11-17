import { Skeleton as UISkeleton } from '@faststore/ui'

import { OrganizationSignInButton } from 'src/components/account/Drawer/OrganizationSignInButton'
import type { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

import type { NavbarProps as SectionNavbarProps } from '../../sections/Navbar'

type NavbarOverrides = ReturnType<typeof useOverrideComponents<'Navbar'>>

export type NavbarAccountAreaProps = {
  /** Whether the B2B session has resolved enough to know what to render. */
  isSignInResolved: boolean
  /** Whether the Organization sign-in area for B2B buyers is enabled. */
  isOrganizationEnabled: boolean | undefined
  isB2BBuyer?: boolean
  signInButton: SectionNavbarProps['signInButton']
  ButtonSignIn: NavbarOverrides['_experimentalButtonSignIn']
  /** Data attribute toggled on the loading skeleton (Navbar vs NavbarSlider). */
  skeletonAttr:
    | 'data-fs-navbar-signin-skeleton'
    | 'data-fs-navbar-slider-signin-skeleton'
}

/**
 * Renders the account/sign-in area shared by the desktop Navbar and the
 * mobile NavbarSlider: a loading skeleton until the B2B session resolves,
 * then either the Organization sign-in button (B2B buyers) or the
 * storefront's own sign-in button.
 */
export const NavbarAccountArea = ({
  isSignInResolved,
  isOrganizationEnabled,
  isB2BBuyer,
  signInButton,
  ButtonSignIn,
  skeletonAttr,
}: NavbarAccountAreaProps) => {
  if (!isSignInResolved) {
    return (
      <UISkeleton
        {...{ [skeletonAttr]: true }}
        size={{ width: '140px', height: '2.5rem' }}
      />
    )
  }

  if (isOrganizationEnabled) {
    return (
      <OrganizationSignInButton
        icon={signInButton.icon}
        isB2BBuyer={isB2BBuyer}
      />
    )
  }

  return <ButtonSignIn.Component {...signInButton} />
}
