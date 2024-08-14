import { useFadeEffect, useUI } from '@faststore/ui'
import { Suspense } from 'react'

import NavbarLinks from 'src/components/navigation/NavbarLinks'
import { ButtonSignInFallback } from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'

import { ButtonSignIn } from 'src/components/ui/Button'

import {
  NavbarSliderContent,
  NavbarSliderFooter,
  NavbarSliderHeader,
  NavbarSlider as NavbarSliderWrapper,
} from '@faststore/ui'

import type { NavbarProps } from '../Navbar'

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
    >
      <NavbarSliderHeader onClose={fadeOut}>
        <Link
          data-fs-navbar-slider-logo
          href={logo.link ? logo.link.url : '/'}
          title={logo.link ? logo.link.title : homeLabel}
          onClick={fadeOut}
        >
          <Logo alt={logo.alt} src={logo.src} />
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
    </NavbarSliderWrapper>
  )
}

export default NavbarSlider
