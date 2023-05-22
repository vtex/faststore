import {
  Navbar as UINavbar,
  NavbarLinks as UINavbarLinks,
  NavbarLinksList as UINavbarLinksList,
  NavbarSlider as UINavbarSlider,
  NavbarSliderHeader as UINavbarSliderHeader,
  NavbarSliderContent as UINavbarSliderContent,
  NavbarSliderFooter as UINavbarSliderFooter,
} from '@faststore/ui'

import SearchInput from 'src/components/search/SearchInput/SearchInput'
import ButtonSignIn from 'src/components/ui/Button/ButtonSignIn'
import CartToggle from 'src/components/cart/CartToggle'
import Logo from 'src/components/ui/Logo'

import RegionButton from 'src/components/region/RegionButton'

import NavbarCustomizations from 'src/customizations/components/overrides/Navbar'

const Components = {
  Navbar: UINavbar,
  Logo,
  SearchInput,
  ButtonSignIn,
  CartToggle,
  NavbarLinks: UINavbarLinks,
  NavbarLinksList: UINavbarLinksList,
  RegionButton,
  NavbarSlider: UINavbarSlider,
  NavbarSliderHeader: UINavbarSliderHeader,
  NavbarSliderContent: UINavbarSliderContent,
  NavbarSliderFooter: UINavbarSliderFooter,
  ...NavbarCustomizations.components,
}

export { Components }
