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
      'Icon',
      'Price',
      'QuantitySelector',
      'SkuSelector',
      'ShippingSimulation',
      'ImageGallery',
      'ImageZoom',
      '__experimentalImageGalleryImage',
      '__experimentalImageGallery',
      '__experimentalShippingSimulation',
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
  ProductGallery: {
    components: [
      'Button',
      'FilterIcon',
      'PrevIcon',
      'ResultsCountSkeleton',
      'SortSkeleton',
      'FilterButtonSkeleton',
      'LinkButtonPrev',
      'LinkButtonNext',
      '__experimentalFilterDesktop',
      '__experimentalFilterSlider',
      '__experimentalProductCard',
    ],
  },
  Alert: {
    components: ['Alert', 'Icon'],
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
