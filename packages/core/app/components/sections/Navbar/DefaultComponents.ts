import {
  IconButton as UIIconButton,
  Navbar as UINavbar,
  NavbarButtons as UINavbarButtons,
  NavbarHeader as UINavbarHeader,
  NavbarLinks as UINavbarLinks,
  NavbarLinksList as UINavbarLinksList,
  NavbarRow as UINavbarRow,
  NavbarSlider as UINavbarSlider,
  NavbarSliderContent as UINavbarSliderContent,
  NavbarSliderFooter as UINavbarSliderFooter,
  NavbarSliderHeader as UINavbarSliderHeader,
} from '@faststore/ui'

import { ButtonSignIn } from 'app/components/ui/Button'

export const NavbarDefaultComponents = {
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
  _experimentalButtonSignIn: ButtonSignIn,
} as const
