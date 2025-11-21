import dynamic from 'next/dynamic'
import { useCallback, useRef, useState } from 'react'

import { Icon as UIIcon, useScrollDirection, useUI } from '@faststore/ui'

import { Skeleton as UISkeleton } from '@faststore/ui'
import { OrganizationSignInButton } from 'src/components/account/MyAccountDrawer/OrganizationSignInButton'
import CartToggle from 'src/components/cart/CartToggle'
import type { SearchInputRef } from 'src/components/search/SearchInput'
import SearchInput from 'src/components/search/SearchInput'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { useSession } from 'src/sdk/session'
import useScreenResize from 'src/sdk/ui/useScreenResize'

import storeConfig from 'discovery.config'
import LocaleSelector from 'src/components/common/Locale/LocaleSelector/LocaleSelector'
import type { NavbarProps as SectionNavbarProps } from '../../sections/Navbar'

const NavbarLinks = dynamic(
  () =>
    /* webpackChunkName: "NavbarLinks" */ import(
      'src/components/navigation/NavbarLinks'
    ),
  {
    ssr: false,
  }
)

const NavbarSlider = dynamic(
  () =>
    /* webpackChunkName: "NavbarSlider" */ import(
      'src/components/navigation/NavbarSlider'
    ),
  { ssr: false }
)

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
  const {
    Navbar: NavbarWrapper,
    NavbarHeader,
    NavbarRow,
    NavbarButtons,
    IconButton,
    _experimentalButtonSignIn: ButtonSignIn,
  } = useOverrideComponents<'Navbar'>()
  const scrollDirection = useScrollDirection()
  const { openNavbar, navbar: displayNavbar } = useUI()
  const { isDesktop } = useScreenResize()
  const { b2b, isSessionReady } = useSession()

  const searchMobileRef = useRef<SearchInputRef>(null)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const isFaststoreMyAccountEnabled =
    storeConfig.experimental?.enableFaststoreMyAccount

  const isRepresentative = b2b?.isRepresentative

  const isOrganizationEnabled = isFaststoreMyAccountEnabled && isRepresentative

  const handlerExpandSearch = useCallback(() => {
    setSearchExpanded(true)
    searchMobileRef.current?.inputRef?.focus()
  }, [])

  const handleCollapseSearch = useCallback(() => {
    setSearchExpanded(false)
    searchMobileRef.current?.resetSearchInput()
  }, [])

  return (
    <NavbarWrapper.Component
      scrollDirection={scrollDirection}
      {...NavbarWrapper.props}
    >
      <NavbarHeader.Component {...NavbarHeader.props}>
        <NavbarRow.Component {...NavbarRow.props}>
          {!searchExpanded && (
            <>
              <IconButton.Component
                data-fs-navbar-button-menu
                onClick={openNavbar}
                icon={<UIIcon name={menuIcon} width={32} height={32} />}
                {...IconButton.props}
                aria-label={menuIconAlt ?? IconButton.props['aria-label']}
              />
              <Link
                data-fs-navbar-logo
                href={logo.link ? logo.link.url : '/'}
                title={logo.link ? logo.link.title : homeLabel}
                prefetch={false}
              >
                <Logo src={logo.src} alt={logo.alt} />
              </Link>
            </>
          )}

          {isDesktop && (
            <SearchInput
              placeholder={searchInput?.placeholder}
              sort={searchInput?.sort}
              quickOrderSettings={searchInput?.quickOrderSettings}
            />
          )}

          <NavbarButtons.Component
            searchExpanded={searchExpanded}
            {...NavbarButtons.props}
          >
            {searchExpanded && (
              <IconButton.Component
                data-fs-button-collapse
                aria-label="Collapse search bar"
                icon={<UIIcon name="CaretLeft" width={32} height={32} />}
                {...IconButton.props}
                // Dynamic props, shouldn't be overridable
                // This decision can be reviewed later if needed
                onClick={handleCollapseSearch}
              />
            )}

            {!isDesktop && (
              <SearchInput
                placeholder=""
                ref={searchMobileRef}
                testId="store-input-mobile"
                buttonTestId="store-input-mobile-button"
                onSearchClick={handlerExpandSearch}
                sort={searchInput?.sort}
                quickOrderSettings={searchInput?.quickOrderSettings}
                hidden={!searchExpanded}
                aria-hidden={!searchExpanded}
              />
            )}

            <LocaleSelector />
            {isDesktop &&
              (isSessionReady ? (
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
                  data-fs-navbar-signin-skeleton
                  size={{ width: '140px', height: '2.5rem' }}
                />
              ))}

            <CartToggle {...cart} />
          </NavbarButtons.Component>
        </NavbarRow.Component>
      </NavbarHeader.Component>

      {isDesktop && <NavbarLinks links={links} region={region} />}

      {displayNavbar && (
        <NavbarSlider
          home={home}
          logo={logo}
          links={links}
          signIn={signIn}
          region={region}
        />
      )}
    </NavbarWrapper.Component>
  )
}

export default Navbar
