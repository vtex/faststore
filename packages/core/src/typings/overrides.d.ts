export const SECTIONS = {
  Hero: {
    components: ['Hero', 'HeroImage', 'HeroHeader'],
  },
  BannerText: {
    components: ['Banner', 'BannerContent'],
  },
  ProductDetails: {
    components: [
      'ProductTitle',
      'DiscountBadge',
      'BuyButton',
      'SkuSelector',
      'ShippingSimulation',
    ],
  },
  ProductShelf: {
    components: [
      'ProductShelf',
      '__experimentalCarousel',
      '__experimentalProductCard',
    ],
  },
  Navbar: {
    components: [
      'Navbar',
      'NavbarLinks',
      'NavbarLinksList',
      'NavbarSlider',
      'NavbarSliderHeader',
      'NavbarSliderContent',
      'NavbarSliderFooter',
      'NavbarHeader',
      'NavbarRow',
      'NavbarButtons',
      'IconButton',
    ],
  },
  Breadcrumb: {
    components: ['Breadcrumb', 'Icon'],
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
