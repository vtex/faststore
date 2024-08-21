import {
  IconButton as UIIconButton,
  Navbar as UINavbar,
  NavbarButtons as UINavbarButtons,
  NavbarHeader as UINavbarHeader,
  NavbarLinks as UINavbarLinks,
  NavbarLinksList as UINavbarLinksList,
  NavbarRow as UINavbarRow,
} from '@faststore/ui'
import dynamic from 'next/dynamic'

const ButtonSignIn = dynamic(() =>
  import(
    /* webpackChunkName: "ButtonSignIn" */ 'src/components/ui/Button'
  ).then((module) => module.ButtonSignIn)
)

const UINavbarSlider = dynamic(() =>
  import(/* webpackChunkName: "UINavbarSlider" */ '@faststore/ui').then(
    (module) => module.NavbarSlider
  )
)
const UINavbarSliderHeader = dynamic(() =>
  import(/* webpackChunkName: "UINavbarSliderHeader" */ '@faststore/ui').then(
    (module) => module.NavbarSliderHeader
  )
)
const UINavbarSliderContent = dynamic(() =>
  import(/* webpackChunkName: "UINavbarSliderContent" */ '@faststore/ui').then(
    (module) => module.NavbarSliderContent
  )
)
const UINavbarSliderFooter = dynamic(() =>
  import(/* webpackChunkName: "UINavbarSliderFooter" */ '@faststore/ui').then(
    (module) => module.NavbarSliderFooter
  )
)

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
