export const SECTIONS = {
  Hero: {
    components: ['Hero', 'HeroImage', 'HeroHeader'],
  },
  BannerText: {
    components: ['BannerText'],
  },
  ProductDetails: {
    components: [
      'UIProductTitle',
      'UIDiscountBadge',
      'UIBuyButton',
      'ShippingSimulation',
      'Selectors',
    ],
  },
  ProductShelf: { components: ['ProductCard', 'Carousel'] },
  Navbar: {
    components: [
      'Navbar',
      'Logo',
      'SearchInput',
      'ButtonSignIn',
      'CartToggle',
      'NavbarLinks',
      'NavbarLinksList',
      'RegionButton',
      'NavbarSlider',
      'NavbarSliderHeader',
      'NavbarSliderContent',
      'NavbarSliderFooter',
    ],
  },
  Breadcrumb: {
    components: ['Breadcrumb'],
  },
} as const

// export type ComponentOrProps =
//   | { Component: React.ElementType }
//   | { props: Record<string, unknown> };

export type SectionOverride = {
  [K in keyof typeof SECTIONS]: {
    name: K
    components: {
      [ComponentKey in (typeof SECTIONS)[K]['components'][number]]?: any
    }
  }
}
