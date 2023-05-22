// This is an example of how it can be used on the starter.

import CustomComponent from '../CustomComponent'

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'Navbar' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    // Navbar: CustomComponent,
    // Logo: CustomComponent,
    // SearchInput: CustomComponent,
    // ButtonSignIn: CustomComponent,
    // CartToggle: CustomComponent,
    // NavbarLinks: CustomComponent,
    // NavbarLinksList: CustomComponent,
    // RegionButton: CustomComponent,
    // NavbarSlider: CustomComponent,
    // NavbarSliderHeader: CustomComponent,
    // NavbarSliderContent: CustomComponent,
    // NavbarSliderFooter: CustomComponent,
  },
}

export default overrides
