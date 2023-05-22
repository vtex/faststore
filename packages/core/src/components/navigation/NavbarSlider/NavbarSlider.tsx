import { useFadeEffect, useUI } from '@faststore/ui'
import { Suspense } from 'react'

import { ButtonSignInFallback } from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'
import { mark } from 'src/sdk/tests/mark'

import type { NavbarProps } from '../Navbar'

import styles from '../../sections/Navbar/section.module.scss'

// import {
//   NavbarHeader as UINavbarHeader,
//   NavbarSlider as UINavbarSlider,
//   NavbarSliderHeader as UINavbarSliderHeader,
//   NavbarSliderContent as UINavbarSliderContent,
//   NavbarSliderFooter as UINavbarSliderFooter,
// } from '@faststore/ui'

import NavbarLinks from 'src/components/navigation/NavbarLinks'

import { Components } from 'src/components/sections/Navbar/Overrides'

const {
  ButtonSignIn,
  Logo,
  NavbarSlider: NavbarSliderOverride,
  NavbarSliderHeader,
  NavbarSliderContent,
  NavbarSliderFooter,
} = Components

interface NavbarSliderProps {
  logo: NavbarProps['logo']
  home: NavbarProps['home']
  links: NavbarProps['links']
  region: NavbarProps['region']
  signIn: NavbarProps['signIn']
}

function NavbarSlider({
  logo,
  links,
  region,
  home: { label: homeLabel },
  signIn: { button: signInButton },
}: NavbarSliderProps) {
  const { closeNavbar } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  return (
    <NavbarSliderOverride
      fade={fade}
      onDismiss={fadeOut}
      overlayProps={{
        className: `section ${styles.section} section-navbar-slider`,
      }}
      onTransitionEnd={() => fade === 'out' && closeNavbar()}
    >
      <NavbarSliderHeader onClose={fadeOut}>
        <Link
          href="/"
          onClick={fadeOut}
          title={homeLabel}
          aria-label={homeLabel}
          data-fs-navbar-slider-logo
        >
          <Logo {...logo} />
        </Link>
      </NavbarSliderHeader>
      <NavbarSliderContent>
        <NavbarLinks onClickLink={fadeOut} links={links} region={region} />
      </NavbarSliderContent>
      <NavbarSliderFooter>
        <Suspense fallback={<ButtonSignInFallback />}>
          <ButtonSignIn {...signInButton} />
        </Suspense>
      </NavbarSliderFooter>
    </NavbarSliderOverride>
  )
}

export default mark(NavbarSlider)
