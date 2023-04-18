import { Suspense } from 'react'
import {
  useUI,
  useFadeEffect,
  NavbarSlider as UINavbarSlider,
  NavbarSliderHeader as UINavbarSliderHeader,
  NavbarSliderContent as UINavbarSliderContent,
  NavbarSliderFooter as UINavbarSliderFooter,
} from '@faststore/ui'

import { mark } from 'src/sdk/tests/mark'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import { ButtonSignIn, ButtonSignInFallback } from 'src/components/ui/Button'

import NavbarLinks from '../NavbarLinks'

function NavbarSlider() {
  const { closeNavbar } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  return (
    <UINavbarSlider
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && closeNavbar()}
    >
      <UINavbarSliderHeader data-fs-navbar-slider-header onClose={fadeOut}>
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
