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

import styles from './section.module.scss'

function NavbarSlider() {
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
          aria-label="Go to FastStore home"
          title="Go to FastStore home"
          data-fs-navbar-slider-logo
        >
          <Logo />
        </Link>
      </UINavbarSliderHeader>
      <UINavbarSliderContent>
        <NavbarLinks onClickLink={fadeOut} />
      </UINavbarSliderContent>
      <UINavbarSliderFooter>
        <Suspense fallback={<ButtonSignInFallback />}>
          <ButtonSignIn />
        </Suspense>
      </UINavbarSliderFooter>
    </UINavbarSlider>
  )
}

export default mark(NavbarSlider)
