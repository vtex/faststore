import { Skeleton as UISkeleton, useFadeEffect, useUI } from '@faststore/ui'
import { Suspense } from 'react'

import storeConfig from 'discovery.config'
import NavbarLinks from 'src/components/navigation/NavbarLinks'
import { ButtonSignInFallback } from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'

import type { NavbarProps } from '../Navbar'

import { OrganizationSignInButton } from 'src/components/account/MyAccountDrawer/OrganizationSignInButton'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { useSession } from 'src/sdk/session'
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
    _experimentalButtonSignIn: ButtonSignIn,
  } = useOverrideComponents<'Navbar'>()

  const { closeNavbar } = useUI()
  const { fade, fadeOut } = useFadeEffect()
  const { b2b, isSessionReady } = useSession()

  const isFaststoreMyAccountEnabled =
    storeConfig.experimental?.enableFaststoreMyAccount

  const isRepresentative = b2b?.isRepresentative

  const isOrganizationEnabled = isFaststoreMyAccountEnabled && isRepresentative

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
          {isSessionReady ? (
            isOrganizationEnabled ? (
              <OrganizationSignInButton
                icon={signInButton.icon}
                isRepresentative={isRepresentative}
              />
            ) : (
              <ButtonSignIn.Component {...signInButton} />
            )
          ) : (
            <UISkeleton
              data-fs-navbar-slider-signin-skeleton
              size={{ width: '140px', height: '2.5rem' }}
            />
          )}
        </Suspense>
      </NavbarSliderFooter.Component>
    </NavbarSliderWrapper.Component>
  )
}

export default NavbarSlider
