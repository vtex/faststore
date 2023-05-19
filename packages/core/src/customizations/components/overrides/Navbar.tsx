// This is an example of how it can be used on the starter.

import CustomComponent from '../CustomComponent'

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'Navbar' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    // Navbar: CustomComponent,
    // UINavbarHeader: CustomComponent,
    // SearchInput: CustomComponent,
    // ButtonSignIn: CustomComponent,
    // CartToggle: CustomComponent,
    // Logo: CustomComponent,
    // NavbarLinks: CustomComponent,
    // RegionButton: CustomComponent,
    // NavbarSlider: CustomComponent,
    // UINavbarSlider: CustomComponent,
    // UINavbarSliderHeader: CustomComponent,
    // UINavbarSliderContent: CustomComponent,
    // UINavbarSliderFooter: CustomComponent,
  },
}

export default overrides
