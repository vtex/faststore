import {
  NavbarHeader as UINavbarHeader,
  NavbarSlider as UINavbarSlider,
  NavbarSliderHeader as UINavbarSliderHeader,
  NavbarSliderContent as UINavbarSliderContent,
  NavbarSliderFooter as UINavbarSliderFooter,
} from '@faststore/ui'

import Navbar from 'src/components/navigation/Navbar'
import SearchInput from 'src/components/search/SearchInput/SearchInput'
import ButtonSignIn from 'src/components/ui/Button/ButtonSignIn'
import CartToggle from 'src/components/cart/CartToggle'
import Logo from 'src/components/ui/Logo'

import NavbarLinks from 'src/components/navigation/NavbarLinks'
import RegionButton from 'src/components/region/RegionButton'

import NavbarSlider from 'src/components/navigation/NavbarSlider'

import NavbarCustomizations from 'src/customizations/components/overrides/Navbar'

const Components = {
  Navbar,
  UINavbarHeader,
  SearchInput,
  ButtonSignIn,
  CartToggle,
  Logo,
  NavbarLinks,
  RegionButton,
  NavbarSlider,
  UINavbarSlider,
  UINavbarSliderHeader,
  UINavbarSliderContent,
  UINavbarSliderFooter,
  ...NavbarCustomizations.components,
}

export { Components }
