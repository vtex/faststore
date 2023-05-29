import {
  Navbar as UINavbar,
  NavbarLinks as UINavbarLinks,
  NavbarLinksList as UINavbarLinksList,
  NavbarSlider as UINavbarSlider,
  NavbarSliderHeader as UINavbarSliderHeader,
  NavbarSliderContent as UINavbarSliderContent,
  NavbarSliderFooter as UINavbarSliderFooter,
  NavbarHeader as UINavbarHeader,
  NavbarRow as UINavbarRow,
  NavbarButtons as UINavbarButtons,
  IconButton as UIIconButton,
} from '@faststore/ui'

import NavbarCustomizations from 'src/customizations/components/overrides/Navbar'

const navbarComponentsCustomization = {}

const navbarPropsCustomization = {} as any

Object.entries(NavbarCustomizations.components).forEach(([key, value]) => {
  if (value.Component) {
    navbarComponentsCustomization[key] = value.Component
  }
})

Object.entries(NavbarCustomizations.components).forEach(([key, value]) => {
  if (value.props) {
    navbarPropsCustomization[key] = value.props
  }
})

const Components = {
  Navbar: UINavbar,
  NavbarLinks: UINavbarLinks,
  NavbarLinksList: UINavbarLinksList,
  NavbarSlider: UINavbarSlider,
  NavbarSliderHeader: UINavbarSliderHeader,
  NavbarSliderContent: UINavbarSliderContent,
  NavbarSliderFooter: UINavbarSliderFooter,
  NavbarHeader: UINavbarHeader,
  NavbarRow: UINavbarRow,
  NavbarButtons: UINavbarButtons,
  IconButton: UIIconButton,
  ...navbarComponentsCustomization,
}

export { Components, navbarPropsCustomization as Props }
