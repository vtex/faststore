import { Suspense, useRef, useState } from 'react'

import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/search/SearchInput'
import type { SearchInputRef } from 'src/components/search/SearchInput'
import Button, {
  ButtonSignIn,
  ButtonSignInFallback,
} from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import { mark } from 'src/sdk/tests/mark'
import { useUI } from 'src/sdk/ui/Provider'
import useScrollDirection from 'src/sdk/ui/useScrollDirection'

import styles from './navbar.module.scss'
import NavbarSlider from './NavbarSlider'
import NavLinks from './NavLinks'

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
    <header
      data-fs-navbar
      data-fs-navbar-scroll={scrollDirection}
      className={`${styles.fsNavbar} layout__content-full`}
    >
      <section data-fs-navbar-header>
        <div className="layout__content" data-fs-navbar-row>
          {!searchExpanded && (
            <>
              <Button
                data-fs-navbar-button-menu
                aria-label="Open Menu"
                icon={<Icon name="List" width={32} height={32} />}
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
          <div
            data-fs-navbar-buttons
            data-fs-navbar-search-expanded={searchExpanded}
          >
            {searchExpanded && (
              <Button
                data-fs-button-collapse
                aria-label="Collapse search bar"
                icon={<Icon name="CaretLeft" width={32} height={32} />}
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
          </div>
        </div>
      </section>
      <NavLinks classes="hidden-mobile" />

      {displayNavbar && <NavbarSlider />}
    </header>
  )
}

Navbar.displayName = 'Navbar'

export default mark(Navbar)
