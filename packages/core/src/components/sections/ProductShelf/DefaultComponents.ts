import dynamic from 'next/dynamic'
const UIProductShelf = dynamic(() =>
  /* webpackChunkName: "UIProductShelf" */
  import('@faststore/ui').then((mod) => mod.ProductShelf)
)

const Carousel = dynamic(
  () =>
    /* webpackChunkName: "Carousel" */
    import('../../ui/Carousel')
)

const ProductCard = dynamic(
  () =>
    /* webpackChunkName: "ProductCard" */
    import('../../product/ProductCard')
)

export const ProductShelfDefaultComponents = {
  ProductShelf: UIProductShelf,
  __experimentalCarousel: Carousel,
  __experimentalProductCard: ProductCard,
} as const
