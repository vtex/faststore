import { List as UIList } from '@faststore/ui'
import { Suspense, useRef, useState } from 'react'
import type { AnchorHTMLAttributes } from 'react'
import type { SearchInputRef } from '@faststore/ui'

import CartToggle from 'src/components/cart/CartToggle'
import LinkFramework from 'src/components/common/Link'
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
import { useModal } from 'src/sdk/ui/modal/Provider'

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

function Navbar() {
  const { onModalClose } = useModal()
  const searchMobileRef = useRef<SearchInputRef>(null)

  const [showMenu, setShowMenu] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const handleCloseSlideOver = () => {
    onModalClose()
    setShowMenu(false)
  }

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
                onClick={() => setShowMenu(true)}
              />
              <LinkFramework
                href="/"
                aria-label="Go to Faststore home"
                title="Go to Faststore home"
                className="navbar__logo"
              >
                <Logo />
              </LinkFramework>
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

      {showMenu && (
        <SlideOver
          isOpen={showMenu}
          onDismiss={handleCloseSlideOver}
          size="full"
          direction="leftSide"
          className="navbar__modal-content"
        >
          <div className="navbar__modal-body">
            <header className="navbar__modal-header">
              <LinkFramework
                href="/"
                onClick={onModalClose}
                aria-label="Go to FastStore home"
                title="Go to FastStore home"
                className="navbar__logo"
              >
                <Logo />
              </LinkFramework>

              <ButtonIcon
                aria-label="Close Menu"
                icon={<Icon name="X" width={32} height={32} />}
                onClick={onModalClose}
              />
            </header>
            <div className="navlinks">
              <NavLinks onClickLink={handleCloseSlideOver} />
              <div className="navlinks__signin">
                <Suspense fallback={<ButtonSignInFallback />}>
                  <ButtonSignIn />
                </Suspense>
              </div>
            </div>
          </div>
        </SlideOver>
      )}
    </header>
  )
}

Navbar.displayName = 'Navbar'

export default mark(Navbar)
