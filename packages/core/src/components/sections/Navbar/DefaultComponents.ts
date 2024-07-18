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

import { ButtonSignIn } from 'src/components/ui/Button'

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
  _experimentalSignInButton: ButtonSignIn,
} as const
