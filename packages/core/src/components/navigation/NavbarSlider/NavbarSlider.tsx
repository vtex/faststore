import {
  NavbarSlider as UINavbarSlider,
  NavbarSliderContent as UINavbarSliderContent,
  NavbarSliderFooter as UINavbarSliderFooter,
  NavbarSliderHeader as UINavbarSliderHeader,
  useFadeEffect,
  useUI,
} from '@faststore/ui'
import { Suspense } from 'react'

import { ButtonSignIn, ButtonSignInFallback } from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import { mark } from 'src/sdk/tests/mark'

import NavbarLinks from '../NavbarLinks'
import type { NavbarProps } from '../Navbar'

import styles from '../../sections/Navbar/section.module.scss'

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
    <UINavbarSlider
      fade={fade}
      onDismiss={fadeOut}
      overlayProps={{
        className: `section ${styles.section} section-navbar-slider`,
      }}
      onTransitionEnd={() => fade === 'out' && closeNavbar()}
    >
      <UINavbarSliderHeader onClose={fadeOut}>
        <Link
          href="/"
          onClick={fadeOut}
          title={homeLabel}
          aria-label={homeLabel}
          data-fs-navbar-slider-logo
        >
          <Logo {...logo} />
        </Link>
      </UINavbarSliderHeader>
      <UINavbarSliderContent>
        <NavbarLinks onClickLink={fadeOut} links={links} region={region} />
      </UINavbarSliderContent>
      <UINavbarSliderFooter>
        <Suspense fallback={<ButtonSignInFallback />}>
          <ButtonSignIn {...signInButton} />
        </Suspense>
      </UINavbarSliderFooter>
    </UINavbarSlider>
  )
}

export default mark(NavbarSlider)
