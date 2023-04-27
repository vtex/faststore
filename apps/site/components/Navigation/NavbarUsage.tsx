import React, { useState, useRef } from 'react'
import {
  useUI,
  Icon,
  IconButton,
  useScrollDirection,
  Navbar,
  NavbarHeader,
  NavbarRow,
  NavbarButtons,
  LinkButton,
  Label,
} from '@faststore/ui'
import SearchInputUsage from '../Search/SearchInputUsage'
import NavbarLinksUsage from './NavbarLinksUsage'
import { NavbarSlider as NavbarSliderUsage } from './NavbarSliderUsage'

function NavbarUsage() {
  const scrollDirection = useScrollDirection()
  const { openNavbar, navbar: displayNavbar } = useUI()

  return (
    <Navbar scrollDirection={scrollDirection}>
      <NavbarHeader>
        <NavbarRow>
          <IconButton
            data-fs-navbar-button-menu
            aria-label="Open Menu"
            icon={<Icon name="List" width={30} height={30} />}
            onClick={openNavbar}
          />
          <Label
            className="hidden-mobile"
            style={{ margin: 20, paddingLeft: 10 }}
          >
            Storefront
          </Label>

          <SearchInputUsage actions={false} />

          <NavbarButtons searchExpanded={false}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginLeft: 50,
              }}
            >
              <LinkButton
                href="#"
                variant="tertiary"
                icon={<Icon name="User" width={18} height={18} weight="bold" />}
              >
                Login
              </LinkButton>

              <IconButton
                data-fs-cart-toggle
                aria-label="cart"
                icon={<Icon name="ShoppingCart" width={32} height={32} />}
              />
            </div>
          </NavbarButtons>
        </NavbarRow>
      </NavbarHeader>

      <NavbarLinksUsage classes="hidden-mobile" />

      {displayNavbar && <NavbarSliderUsage />}
    </Navbar>
  )
}

export default NavbarUsage
