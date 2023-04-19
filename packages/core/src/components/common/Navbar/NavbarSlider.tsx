import {
  SlideOver as UISlideOver,
  SlideOverHeader as UISlideOverHeader,
} from '@faststore/ui'
import { Suspense } from 'react'

import { useFadeEffect, useUI } from '@faststore/ui'
import { ButtonSignIn, ButtonSignInFallback } from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import { mark } from 'src/sdk/tests/mark'

import NavLinks from './NavLinks'
import styles from './sectionNavbarSlider.module.scss'

function NavbarSlider() {
  const { closeNavbar } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  return (
    <UISlideOver
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size="full"
      direction="leftSide"
      overlayProps={{
        className: `section ${styles.section} section-navbar-slider`,
      }}
      data-fs-navbar-slider
      onTransitionEnd={() => fade === 'out' && closeNavbar()}
    >
      <UISlideOverHeader data-fs-navbar-slider-header onClose={fadeOut}>
        <Link
          href="/"
          onClick={fadeOut}
          aria-label="Go to FastStore home"
          title="Go to FastStore home"
          data-fs-navbar-slider-logo
        >
          <Logo />
        </Link>
      </UISlideOverHeader>
      <div data-fs-navbar-slider-content>
        <NavLinks onClickLink={fadeOut} />
      </div>
      <footer data-fs-navbar-slider-footer>
        <Suspense fallback={<ButtonSignInFallback />}>
          <ButtonSignIn />
        </Suspense>
      </footer>
    </UISlideOver>
  )
}

export default mark(NavbarSlider)
