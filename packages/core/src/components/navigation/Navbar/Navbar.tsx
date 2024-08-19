import dynamic from 'next/dynamic'
import { useCallback, useRef, useState } from 'react'

import { Icon as UIIcon, useScrollDirection, useUI } from '@faststore/ui'

import CartToggle from 'src/components/cart/CartToggle'
import type { SearchInputRef } from 'src/components/search/SearchInput'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
const NavbarLinks = dynamic(
  () =>
    /* webpackChunkName: "NavbarLinks" */ import(
      'src/components/navigation/NavbarLinks'
    ),
  { ssr: false }
)
const NavbarSlider = dynamic(
  () =>
    /* webpackChunkName: "NavbarSlider" */ import(
      'src/components/navigation/NavbarSlider'
    ),
  { ssr: false }
)
const SearchInput = dynamic(
  () =>
    /* webpackChunkName: "SearchInput" */ import(
      'src/components/search/SearchInput'
    ),
  { ssr: false }
)

import {
  IconButton,
  NavbarButtons,
  NavbarHeader,
  NavbarRow,
  Navbar as NavbarWrapper,
} from '@faststore/ui'

import { ButtonSignIn } from 'src/components/ui/Button'

import type { NavbarProps as SectionNavbarProps } from '../../sections/Navbar'

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

  // lazy load components to improve performance (PSI)
  const isMobile = window.innerWidth <= 412

  const handlerExpandSearch = useCallback(() => {
    setSearchExpanded(true)
    searchMobileRef.current?.inputRef?.focus()
  }, [])

  const handleCollapseSearch = useCallback(() => {
    setSearchExpanded(false)
    searchMobileRef.current?.resetSearchInput()
  }, [])

  return (
    <NavbarWrapper scrollDirection={scrollDirection}>
      <NavbarHeader>
        <NavbarRow>
          {!searchExpanded && (
            <>
              <IconButton
                data-fs-navbar-button-menu
                onClick={openNavbar}
                icon={<UIIcon name={menuIcon} width={32} height={32} />}
                aria-label={menuIconAlt}
              />
              <Link
                data-fs-navbar-logo
                href={logo.link ? logo.link.url : '/'}
                title={logo.link ? logo.link.title : homeLabel}
                prefetch={false}
              >
                <Logo src={logo.src} alt={logo.alt} loading="eager" />
              </Link>
            </>
          )}

          {!isMobile && (
            <SearchInput
              placeholder={searchInput?.placeholder}
              sort={searchInput?.sort}
            />
          )}

          <NavbarButtons searchExpanded={searchExpanded}>
            {searchExpanded && (
              <IconButton
                data-fs-button-collapse
                aria-label="Collapse search bar"
                icon={<UIIcon name="CaretLeft" width={32} height={32} />}
                // Dynamic props, shouldn't be overridable
                // This decision can be reviewed later if needed
                onClick={handleCollapseSearch}
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
          </NavbarButtons>
        </NavbarRow>
      </NavbarHeader>

      {!isMobile && (
        <NavbarLinks links={links} region={region} className="hidden-mobile" />
      )}

      {displayNavbar && (
        <NavbarSlider
          home={home}
          logo={logo}
          links={links}
          signIn={signIn}
          region={region}
        />
      )}
    </NavbarWrapper>
  )
}

export default Navbar
