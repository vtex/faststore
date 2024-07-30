import { useFadeEffect, useUI } from '@faststore/ui'
import { Suspense } from 'react'

import NavbarLinks from 'app/components/navigation/NavbarLinks'
import { ButtonSignIn, ButtonSignInFallback } from 'app/components/ui/Button'
import Link from 'app/components/ui/Link'
import Logo from 'app/components/ui/Logo'
import { mark } from 'src/sdk/tests/mark'

import type { NavbarProps } from '../Navbar'

import { useOverrideComponents } from 'app/sdk/overrides/OverrideContext'
import styles from './section.module.scss'

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
  const {
    NavbarSlider: NavbarSliderWrapper,
    NavbarSliderHeader,
    NavbarSliderContent,
    NavbarSliderFooter,
  } = useOverrideComponents<'Navbar'>()

  const { closeNavbar } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  return (
    <NavbarSliderWrapper.Component
      fade={fade}
      onDismiss={fadeOut}
      overlayProps={{
        className: `section ${styles.section} section-navbar-slider`,
      }}
      onTransitionEnd={() => fade === 'out' && closeNavbar()}
      {...NavbarSliderWrapper.props}
    >
      <NavbarSliderHeader.Component
        onClose={fadeOut}
        {...NavbarSliderHeader.props}
      >
        <Link
          data-fs-navbar-slider-logo
          href={logo.link ? logo.link.url : '/'}
          title={logo.link ? logo.link.title : homeLabel}
          onClick={fadeOut}
        >
          <Logo alt={logo.alt} src={logo.src} />
        </Link>
      </NavbarSliderHeader.Component>
      <NavbarSliderContent.Component {...NavbarSliderContent.props}>
        <NavbarLinks onClickLink={fadeOut} links={links} region={region} />
      </NavbarSliderContent.Component>
      <NavbarSliderFooter.Component {...NavbarSliderFooter.props}>
        <Suspense fallback={<ButtonSignInFallback />}>
          <ButtonSignIn {...signInButton} />
        </Suspense>
      </NavbarSliderFooter.Component>
    </NavbarSliderWrapper.Component>
  )
}

export default mark(NavbarSlider)
