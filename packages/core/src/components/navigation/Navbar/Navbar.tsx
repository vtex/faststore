import { Suspense, useRef, useState } from 'react'

import {
  useUI,
  useScrollDirection,
  Icon as UIIcon,
  IconButton as UIIconButton,
  Navbar as UINavbar,
  NavbarHeader as UINavbarHeader,
  NavbarRow as UINavbarRow,
  NavbarButtons as UINavbarButtons,
} from '@faststore/ui'

import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/search/SearchInput'
import type { SearchInputRef } from 'src/components/search/SearchInput'
import Logo from 'src/components/ui/Logo'
import Link from 'src/components/ui/Link'
import { ButtonSignIn, ButtonSignInFallback } from 'src/components/ui/Button'
import { mark } from 'src/sdk/tests/mark'

import NavbarSlider from '../NavbarSlider'
import NavbarLinks from '../NavbarLinks'

function Navbar() {
  const scrollDirection = useScrollDirection()
  const { openNavbar, navbar: displayNavbar } = useUI()
  const searchMobileRef = useRef<SearchInputRef>(null)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const handlerExpandSearch = () => {
    setSearchExpanded(true)
    searchMobileRef.current?.inputRef?.focus()
  }

  return (
    <UINavbar
      className="layout__content-full"
      data-fs-navbar-scroll={scrollDirection}
    >
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
                <Logo />
              </Link>
            </>
          )}

          <SearchInput />

          <UINavbarButtons data-fs-navbar-search-expanded={searchExpanded}>
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
              <ButtonSignIn />
            </Suspense>

            <CartToggle />
          </UINavbarButtons>
        </UINavbarRow>
      </UINavbarHeader>

      <NavbarLinks className="hidden-mobile" />

      {displayNavbar && <NavbarSlider />}
    </UINavbar>
  )
}

Navbar.displayName = 'Navbar'
export default mark(Navbar)
