export const SECTIONS = {
  ProductDetails: { components: ['Price', 'ProductCard'] },
  Hero,
  BannerText,
  ProductShelf: { components: ['ProductCard', 'Carousel'] },
  Hero: {
    components: ['UIHero'],
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
