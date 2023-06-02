// This is an example of how it can be used on the starter.

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'Navbar' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    Navbar: { props: {} },
    NavbarLinks: { props: {} },
    NavbarLinksList: { props: {} },
    NavbarSlider: { props: {} },
    NavbarSliderHeader: { props: {} },
    NavbarSliderContent: { props: {} },
    NavbarSliderFooter: { props: {} },
    NavbarHeader: { props: {} },
    NavbarRow: { props: {} },
    NavbarButtons: { props: {} },
    IconButton: { props: {} },
  },
}

export default overrides
