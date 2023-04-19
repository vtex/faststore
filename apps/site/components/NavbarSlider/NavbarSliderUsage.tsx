import React, { useState } from 'react'
import {
  useUI,
  useFadeEffect,
  Icon,
  List,
  Button,
  IconButton,
  NavbarSlider as UINavbarSlider,
  NavbarSliderHeader as UINavbarSliderHeader,
  NavbarSliderContent as UINavbarSliderContent,
  NavbarSliderFooter as UINavbarSliderFooter,
} from '@faststore/ui'
import type { NavbarSliderProps } from '@faststore/ui'

const NavbarSlider = () => {
  const { closeNavbar } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  const links = [
    'Office',
    'Home Appliances',
    'Computer and Software',
    'Technology',
  ]

  return (
    <UINavbarSlider
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && closeNavbar()}
    >
      <UINavbarSliderHeader onClose={fadeOut}>
        <IconButton
          onClick={fadeOut}
          aria-label="Logo"
          icon={<Icon name="Storefront" width={32} height={32} />}
        />
      </UINavbarSliderHeader>
      <UINavbarSliderContent>
        <List>
          {links.map((link) => (
            <li>
              <a href="#">{link}</a>
            </li>
          ))}
        </List>
      </UINavbarSliderContent>
      <UINavbarSliderFooter>
        <Button onClick={fadeOut} aria-label="Info">
          Sign In
        </Button>
      </UINavbarSliderFooter>
    </UINavbarSlider>
  )
}

const NavbarSliderUsage = () => {
  const { openNavbar, navbar: displayNavbar } = useUI()

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        aria-label="Open Menu"
        icon={<Icon name="List" width={32} height={32} />}
        onClick={openNavbar}
      />
      <p style={{ marginLeft: '12px' }}>Open Menu</p>
      {displayNavbar && <NavbarSlider />}
    </div>
  )
}

export default NavbarSliderUsage
