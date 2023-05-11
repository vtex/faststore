import { Suspense, useRef, useState } from 'react'

import {
  useUI,
  useScrollDirection,
  Icon as UIIcon,
  Navbar as UINavbar,
  NavbarRow as UINavbarRow,
  IconButton as UIIconButton,
  NavbarButtons as UINavbarButtons,
  NavbarHeader as UINavbarHeader,
} from '@faststore/ui'

import { mark } from 'src/sdk/tests/mark'

import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/search/SearchInput'
import type { SearchInputRef } from 'src/components/search/SearchInput'

import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import { ButtonSignIn, ButtonSignInFallback } from 'src/components/ui/Button'

import NavbarLinks from '../NavbarLinks'
import NavbarSlider from '../NavbarSlider'
import type { NavbarProps as SectionNavbarProps } from '../../sections/Navbar'

export interface NavbarProps {
  /**
   * Logo props.
   */
  logo: SectionNavbarProps['logo']
  /**
   * Cart props.
   */
  cart: { icon: string }
  /**
   * Sign In props.
   */
  signIn: {
    button: {
      icon: string
      label: string
    }
  }
  /**
   * Region props.
   */
  region: {
    icon: string
    label: string
    shouldDisplayRegion: boolean
  }
  /**
   * Page links.
   */
  links: SectionNavbarProps['navigation']['pageLinks']
}

function Navbar({
  logo,
  links,
  signIn,
  region,
  cart: { icon: cartIcon },
  signIn: { button: signInButton },
}: NavbarProps) {
  const scrollDirection = useScrollDirection()
  const { openNavbar, navbar: displayNavbar } = useUI()
  const searchMobileRef = useRef<SearchInputRef>(null)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const handlerExpandSearch = () => {
    setSearchExpanded(true)
    searchMobileRef.current?.inputRef?.focus()
  }

  return (
    <UINavbar scrollDirection={scrollDirection}>
      <UINavbarHeader>
        <UINavbarRow className="layout__content">
          {!searchExpanded && (
            <>
              <UIIconButton
                data-fs-navbar-button-menu
                aria-label="Open Menu"
                icon={<UIIcon name="List" width={32} height={32} />}
                onClick={openNavbar}
              />
              <Link
                href="/"
                aria-label="Go to Faststore home"
                title="Go to Faststore home"
                data-fs-navbar-logo
              >
                <Logo loading="eager" {...logo} />
              </Link>
            </>
          )}

          <SearchInput />

          <UINavbarButtons searchExpanded={searchExpanded}>
            {searchExpanded && (
              <UIIconButton
                data-fs-button-collapse
                aria-label="Collapse search bar"
                icon={<UIIcon name="CaretLeft" width={32} height={32} />}
                onClick={() => {
                  setSearchExpanded(false)
                  searchMobileRef.current?.resetSearchInput()
                }}
              />
            )}

            <SearchInput
              placeholder=""
              ref={searchMobileRef}
              testId="store-input-mobile"
              buttonTestId="store-input-mobile-button"
              onSearchClick={handlerExpandSearch}
            />

            <Suspense fallback={<ButtonSignInFallback />}>
              <ButtonSignIn {...signInButton} />
            </Suspense>

            <CartToggle icon={cartIcon} />
          </UINavbarButtons>
        </UINavbarRow>
      </UINavbarHeader>

      <NavbarLinks links={links} region={region} className="hidden-mobile" />

      {displayNavbar && (
        <NavbarSlider
          logo={logo}
          links={links}
          signIn={signIn}
          region={region}
        />
      )}
    </UINavbar>
  )
}

Navbar.displayName = 'Navbar'
export default mark(Navbar)
