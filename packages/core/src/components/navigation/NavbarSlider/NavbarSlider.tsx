import { useFadeEffect, useUI } from '@faststore/ui'
import { Suspense } from 'react'

import { ButtonSignIn, ButtonSignInFallback } from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'
import NavbarLinks from 'src/components/navigation/NavbarLinks'
import Logo from 'src/components/ui/Logo'
import { mark } from 'src/sdk/tests/mark'

import type { NavbarProps } from '../Navbar'

import styles from './section.module.scss'

import {
  NavbarSlider as NavbarSliderWrapper,
  NavbarSliderHeader,
  NavbarSliderContent,
  NavbarSliderFooter,
} from 'src/components/sections/Navbar/Overrides'

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
        {...NavbarSliderWrapper.props}
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
