export const SECTIONS = {
  Hero: {
    components: ['UIHero', 'UIHeroImage', 'UIHeroHeader'],
  },
  BannerText: {
    components: ['UIBannerText'],
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
      'UINavbarHeader',
      'UINavbarSliderHeader',
      'UINavbarSliderContent',
      'UINavbarSliderFooter',
      'Navbar',
      'NavbarLinks',
      'NavbarSlider',
      'SearchInput',
      'RegionButton',
      'ButtonSignIn',
      'CartToggle',
      'Logo',
      'UINavbarSlider',
    ],
  },
  Breadcrumb: {
    components: ['UIBreadcrumb'],
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
