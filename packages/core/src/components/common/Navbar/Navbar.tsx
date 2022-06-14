import { List as UIList } from '@faststore/ui'
import { Suspense, useRef, useState } from 'react'
import type { AnchorHTMLAttributes } from 'react'
import type { SearchInputRef } from '@faststore/ui'

import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/common/SearchInput'
import RegionalizationButton from 'src/components/regionalization/RegionalizationButton'
import {
  ButtonIcon,
  ButtonSignIn,
  ButtonSignInFallback,
} from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import SlideOver from 'src/components/ui/SlideOver'
import { mark } from 'src/sdk/tests/mark'
import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

interface NavLinksProps {
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
}

const collections = [
  {
    name: 'Office',
    href: '/office',
  },
  {
    name: 'Home Appliances',
    href: '/kitchen---home-appliances',
  },
  {
    name: 'Computer and Software',
    href: '/computer---software',
  },
  {
    name: 'Technology',
    href: '/technology',
  },
]

function NavLinks({ onClickLink }: NavLinksProps) {
  return (
    <nav className="navlinks__list">
      <UIList>
        <li>
          <RegionalizationButton classes="hidden-mobile" />
        </li>
        {collections.map(({ href, name }) => (
          <li key={name}>
            <Link variant="display" href={href} onClick={onClickLink}>
              {name}
            </Link>
          </li>
        ))}
      </UIList>
    </nav>
  )
}

function NavbarSlider() {
  const { closeNavbar } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  return (
    <SlideOver
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size="full"
      direction="leftSide"
      className="navbar__modal-content"
      onTransitionEnd={() => fade === 'out' && closeNavbar()}
    >
      <div className="navbar__modal-body">
        <header className="navbar__modal-header">
          <Link
            href="/"
            onClick={fadeOut}
            aria-label="Go to FastStore home"
            title="Go to FastStore home"
            className="navbar__logo"
          >
            <Logo />
          </Link>

          <ButtonIcon
            aria-label="Close Menu"
            icon={<Icon name="X" width={32} height={32} />}
            onClick={fadeOut}
          />
        </header>
        <div className="navlinks">
          <NavLinks onClickLink={fadeOut} />
          <div className="navlinks__signin">
            <Suspense fallback={<ButtonSignInFallback />}>
              <ButtonSignIn />
            </Suspense>
          </div>
        </div>
      </div>
    </SlideOver>
  )
}

function Navbar() {
  const { openNavbar, navbar: displayNavbar } = useUI()
  const searchMobileRef = useRef<SearchInputRef>(null)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const handlerExpandSearch = () => {
    setSearchExpanded(true)
    searchMobileRef.current?.inputRef?.focus()
  }

  return (
    <header className="navbar layout__content-full">
      <div className="navbar__header layout__content">
        <section className="navbar__row">
          {!searchExpanded && (
            <>
              <ButtonIcon
                data-fs-button-menu
                aria-label="Open Menu"
                icon={<Icon name="List" width={32} height={32} />}
                onClick={openNavbar}
              />
              <Link
                href="/"
                aria-label="Go to Faststore home"
                title="Go to Faststore home"
                className="navbar__logo"
              >
                <Logo />
              </Link>
            </>
          )}
          <SearchInput />
          <div
            className="navbar__buttons"
            data-store-search-expanded={searchExpanded}
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
        <NavLinks />
      </div>

      {displayNavbar && <NavbarSlider />}
    </header>
  )
}

Navbar.displayName = 'Navbar'

export default mark(Navbar)
