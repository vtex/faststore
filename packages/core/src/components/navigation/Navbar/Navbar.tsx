import { useRef, useState } from 'react'

import { useUI, useScrollDirection, Icon as UIIcon } from '@faststore/ui'

import { mark } from 'src/sdk/tests/mark'

import type { SearchInputRef } from 'src/components/search/SearchInput'
import SearchInput from 'src/components/search/SearchInput'
import NavbarLinks from 'src/components/navigation/NavbarLinks'
import NavbarSlider from 'src/components/navigation/NavbarSlider'
import CartToggle from 'src/components/cart/CartToggle'
import Logo from 'src/components/ui/Logo'
import Link from 'src/components/ui/Link'
import { ButtonSignIn } from 'src/components/ui/Button'

import type { NavbarProps as SectionNavbarProps } from '../../sections/Navbar'

import { Components, Props } from 'src/components/sections/Navbar/Overrides'

const {
  Navbar: NavbarWrapper,
  NavbarHeader,
  NavbarRow,
  NavbarButtons,
  IconButton,
} = Components

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
    icon: {
      icon: menuIcon,
      alt: menuIconAlt = Props['IconButton']['aria-label'],
    },
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
    <NavbarWrapper scrollDirection={scrollDirection} {...Props['Navbar']}>
      <NavbarHeader {...Props['NavbarHeader']}>
        <NavbarRow className="layout__content" {...Props['NavbarRow']}>
          {!searchExpanded && (
            <>
              <IconButton
                data-fs-navbar-button-menu
                onClick={openNavbar}
                icon={<UIIcon name={menuIcon} width={32} height={32} />}
                {...Props['IconButton']}
                aria-label={menuIconAlt}
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

          <NavbarButtons
            searchExpanded={searchExpanded}
            {...Props['NavbarButtons']}
          >
            {searchExpanded && (
              <IconButton
                data-fs-button-collapse
                aria-label="Collapse search bar"
                icon={<UIIcon name="CaretLeft" width={32} height={32} />}
                onClick={() => {
                  setSearchExpanded(false)
                  searchMobileRef.current?.resetSearchInput()
                }}
                {...Props['IconButton']}
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
    </NavbarWrapper>
  )
}

Navbar.displayName = 'Navbar'
export default mark(Navbar)
