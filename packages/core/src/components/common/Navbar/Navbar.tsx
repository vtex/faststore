import type { SearchInputRef } from '@faststore/ui'
import { Suspense, useRef, useState } from 'react'

import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/common/SearchInput'
import {
  ButtonIcon,
  ButtonSignIn,
  ButtonSignInFallback,
} from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import { mark } from 'src/sdk/tests/mark'
import { useUI } from 'src/sdk/ui/Provider'

import styles from './navbar.module.scss'
import NavbarSlider from './NavbarSlider'
import NavLinks from './NavLinks'

function Navbar() {
  const { openNavbar, navbar: displayNavbar } = useUI()
  const searchMobileRef = useRef<SearchInputRef>(null)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const handlerExpandSearch = () => {
    setSearchExpanded(true)
    searchMobileRef.current?.inputRef?.focus()
  }

  return (
    <header className={`${styles.fsNavbar} layout__content-full`}>
      <div className="layout__content" data-fs-navbar-header>
        <section data-fs-navbar-row>
          {!searchExpanded && (
            <>
              <ButtonIcon
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
              <ButtonIcon
                data-fs-button-collapse
                aria-label="Collapse search bar"
                icon={<Icon name="CaretLeft" width={32} height={32} />}
                onClick={() => setSearchExpanded(false)}
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
        </section>
        <NavLinks classes="hidden-mobile" />
      </div>

      {displayNavbar && <NavbarSlider />}
    </header>
  )
}

Navbar.displayName = 'Navbar'

export default mark(Navbar)
