import { Skeleton as UISkeleton } from '@faststore/ui'

import { OrganizationSignInButton } from 'src/components/account/Drawer/OrganizationSignInButton'
import type { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

import type { NavbarProps as SectionNavbarProps } from '../../sections/Navbar'

type NavbarOverrides = ReturnType<typeof useOverrideComponents<'Navbar'>>

export type NavbarAccountAreaProps = {
  /** Whether the B2B session has resolved enough to know what to render. */
  isSignInResolved: boolean
  /** Whether the representative-only Organization sign-in area is enabled. */
  isOrganizationEnabled: boolean | undefined
  isRepresentative?: boolean
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
 * then either the Organization sign-in button (representatives) or the
 * storefront's own sign-in button.
 */
export const NavbarAccountArea = ({
  isSignInResolved,
  isOrganizationEnabled,
  isRepresentative,
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
        isRepresentative={isRepresentative}
      />
    )
  }

  return <ButtonSignIn.Component {...signInButton} />
}
