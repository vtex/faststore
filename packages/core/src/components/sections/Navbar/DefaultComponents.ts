import {
  IconButton as UIIconButton,
  Navbar as UINavbar,
  NavbarButtons as UINavbarButtons,
  NavbarHeader as UINavbarHeader,
  NavbarLinks as UINavbarLinks,
  NavbarLinksList as UINavbarLinksList,
  NavbarRow as UINavbarRow,
} from '@vtex/faststore-ui'

import dynamic from 'next/dynamic'

const ButtonSignIn = dynamic(() =>
  import(/* webpackChunkName: "ButtonSignIn" */ '../../ui/Button').then(
    (module) => module.ButtonSignIn
  )
)

const UINavbarSlider = dynamic(() =>
  import(/* webpackChunkName: "UINavbarSlider" */ '@vtex/faststore-ui').then(
    (module) => module.NavbarSlider
  )
)
const UINavbarSliderHeader = dynamic(() =>
  import(
    /* webpackChunkName: "UINavbarSliderHeader" */ '@vtex/faststore-ui'
  ).then((module) => module.NavbarSliderHeader)
)
const UINavbarSliderContent = dynamic(() =>
  import(
    /* webpackChunkName: "UINavbarSliderContent" */ '@vtex/faststore-ui'
  ).then((module) => module.NavbarSliderContent)
)
const UINavbarSliderFooter = dynamic(() =>
  import(
    /* webpackChunkName: "UINavbarSliderFooter" */ '@vtex/faststore-ui'
  ).then((module) => module.NavbarSliderFooter)
)

const SKUMatrixSidebar = dynamic(() =>
  import(
    /* webpackChunkName: "UISKUMatrixSidebar" */ '../../ui/SKUMatrix/SKUMatrixSidebar'
  ).then((module) => module.default)
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
  __experimentalSKUMatrixSidebar: SKUMatrixSidebar,
} as const
