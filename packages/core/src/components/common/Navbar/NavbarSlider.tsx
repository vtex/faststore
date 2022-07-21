import { Suspense } from 'react'

import Button, {
  ButtonSignIn,
  ButtonSignInFallback,
} from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import SlideOver from 'src/components/ui/SlideOver'
import { mark } from 'src/sdk/tests/mark'
import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

import styles from './navbar-slider.module.scss'
import NavLinks from './NavLinks'

function NavbarSlider() {
  const { closeNavbar } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  return (
    <SlideOver
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size="full"
      direction="leftSide"
      className={styles.fsNavbarSlider}
      onTransitionEnd={() => fade === 'out' && closeNavbar()}
    >
      <header data-fs-navbar-slider-header>
        <Link
          href="/"
          onClick={fadeOut}
          aria-label="Go to FastStore home"
          title="Go to FastStore home"
          data-fs-navbar-slider-logo
        >
          <Logo />
        </Link>

        <Button
          variant="tertiary"
          data-fs-button-icon
          data-fs-navbar-slider-button
          aria-label="Close Menu"
          icon={<Icon name="X" width={32} height={32} />}
          onClick={fadeOut}
        />
      </header>
      <div data-fs-navbar-slider-content>
        <NavLinks onClickLink={fadeOut} />
      </div>
      <footer data-fs-navbar-slider-footer>
        <Suspense fallback={<ButtonSignInFallback />}>
          <ButtonSignIn />
        </Suspense>
      </footer>
    </SlideOver>
  )
}

export default mark(NavbarSlider)
