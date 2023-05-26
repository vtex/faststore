import { Suspense, useRef, useState } from 'react'

import {
  Icon as UIIcon,
  IconButton as UIIconButton,
  Navbar as UINavbar,
  NavbarButtons as UINavbarButtons,
  NavbarHeader as UINavbarHeader,
  NavbarRow as UINavbarRow,
  useScrollDirection,
  useUI,
} from '@faststore/ui'

import { mark } from 'src/sdk/tests/mark'

import CartToggle from 'src/components/cart/CartToggle'
import type { SearchInputRef } from 'src/components/search/SearchInput'
import SearchInput from 'src/components/search/SearchInput'

import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import { ButtonSignIn } from 'src/components/ui/Button'

import type { NavbarProps as SectionNavbarProps } from '../../sections/Navbar'
import NavbarLinks from '../NavbarLinks'
import NavbarSlider from '../NavbarSlider'

export interface NavbarProps {
  /**
   * Logo props.
   */
  logo: SectionNavbarProps['logo']
  /**
   * Search Input props.
   */
  searchInput: SectionNavbarProps['searchInput']
  /**
   * Cart props.
   */
  cart: SectionNavbarProps['cartIcon']
  /**
   * Sign In props.
   */
  signIn: {
    button: SectionNavbarProps['signInButton']
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
  /**
   * Home props.
   */
  home: SectionNavbarProps['navigation']['home']
  /**
   * Menu props.
   */
  menu: SectionNavbarProps['navigation']['menu']
}

function Navbar({
  cart,
  logo,
  searchInput,
  home,
  links,
  signIn,
  region,
  home: { label: homeLabel },
  signIn: { button: signInButton },
  menu: {
    icon: { icon: menuIcon, alt: menuIconAlt },
  },
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
                onClick={openNavbar}
                aria-label={menuIconAlt}
                icon={<UIIcon name={menuIcon} width={32} height={32} />}
              />
              <Link
                href="/"
                data-fs-navbar-logo
                prefetch={false}
                title={homeLabel}
                aria-label={homeLabel}
              >
                <Logo {...logo} />
              </Link>
            </>
          )}

          <SearchInput sort={searchInput?.sort} />

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
              sort={searchInput?.sort}
              hidden={!searchExpanded}
              aria-hidden={!searchExpanded}
            />

            <ButtonSignIn {...signInButton} />

            <CartToggle {...cart} />
          </UINavbarButtons>
        </UINavbarRow>
      </UINavbarHeader>

      <NavbarLinks links={links} region={region} className="hidden-mobile" />

      {displayNavbar && (
        <NavbarSlider
          home={home}
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
