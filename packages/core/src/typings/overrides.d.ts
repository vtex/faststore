export const SECTIONS = {
  Hero: {
    components: ['UIHero'],
  },
  BannerText: {
    components: ['UIBannerText'],
  },
  ProductDetails: { components: ['Price', 'ProductCard'] },
  ProductShelf: { components: ['ProductCard', 'Carousel'] },
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
