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
import type {
  IconButtonProps,
  NavbarButtonsProps,
  NavbarHeaderProps,
  NavbarLinksListProps,
  NavbarLinksProps,
  NavbarProps,
  NavbarRowProps,
  NavbarSliderContentProps,
  NavbarSliderFooterProps,
  NavbarSliderHeaderProps,
  NavbarSliderProps,
} from '@faststore/ui'

import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinition,
} from 'src/typings/overrides'
import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/Navbar'

export type NavbarOverrideDefinition = SectionOverrideDefinition<
  'Navbar',
  {
    Navbar: ComponentOverrideDefinition<NavbarProps, NavbarProps>
    NavbarLinks: ComponentOverrideDefinition<NavbarLinksProps, NavbarLinksProps>
    NavbarLinksList: ComponentOverrideDefinition<
      NavbarLinksListProps,
      NavbarLinksListProps
    >
    NavbarSlider: ComponentOverrideDefinition<
      NavbarSliderProps,
      NavbarSliderProps
    >
    NavbarSliderHeader: ComponentOverrideDefinition<
      NavbarSliderHeaderProps,
      NavbarSliderHeaderProps
    >
    NavbarSliderContent: ComponentOverrideDefinition<
      NavbarSliderContentProps,
      NavbarSliderContentProps
    >
    NavbarSliderFooter: ComponentOverrideDefinition<
      NavbarSliderFooterProps,
      NavbarSliderFooterProps
    >
    NavbarHeader: ComponentOverrideDefinition<
      NavbarHeaderProps,
      NavbarHeaderProps
    >
    NavbarRow: ComponentOverrideDefinition<NavbarRowProps, NavbarRowProps>
    NavbarButtons: ComponentOverrideDefinition<
      NavbarButtonsProps,
      NavbarButtonsProps
    >
    IconButton: ComponentOverrideDefinition<
      IconButtonProps,
      Omit<IconButtonProps, 'onClick'>
    >
  }
>

const {
  Navbar,
  NavbarLinks,
  NavbarLinksList,
  NavbarSlider,
  NavbarSliderHeader,
  NavbarSliderContent,
  NavbarSliderFooter,
  NavbarHeader,
  NavbarRow,
  NavbarButtons,
  IconButton,
} = getSectionOverrides(
  {
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
  },
  override as NavbarOverrideDefinition
)

export {
  Navbar,
  NavbarLinks,
  NavbarLinksList,
  NavbarSlider,
  NavbarSliderHeader,
  NavbarSliderContent,
  NavbarSliderFooter,
  NavbarHeader,
  NavbarRow,
  NavbarButtons,
  IconButton,
}
