import { useFadeEffect, useUI } from '@faststore/ui'
import { Suspense } from 'react'

import { ButtonSignIn, ButtonSignInFallback } from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'
import NavbarLinks from 'src/components/navigation/NavbarLinks'
import Logo from 'src/components/ui/Logo'
import { mark } from 'src/sdk/tests/mark'

import type { NavbarProps } from '../Navbar'

import styles from '../../sections/Navbar/section.module.scss'

import { Components, Props } from 'src/components/sections/Navbar/Overrides'

const {
  NavbarSlider: NavbarSliderWrapper,
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
    <NavbarSliderWrapper
      fade={fade}
      onDismiss={fadeOut}
      overlayProps={{
        className: `section ${styles.section} section-navbar-slider`,
      }}
      onTransitionEnd={() => fade === 'out' && closeNavbar()}
      {...Props['NavbarSlider']}
    >
      <NavbarSliderHeader onClose={fadeOut} {...Props['NavbarSliderHeader']}>
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
      <NavbarSliderContent {...Props['NavbarSliderContent']}>
        <NavbarLinks onClickLink={fadeOut} links={links} region={region} />
      </NavbarSliderContent>
      <NavbarSliderFooter {...Props['NavbarSliderFooter']}>
        <Suspense fallback={<ButtonSignInFallback />}>
          <ButtonSignIn {...signInButton} />
        </Suspense>
      </NavbarSliderFooter>
    </NavbarSliderWrapper>
  )
}

export default mark(NavbarSlider)
