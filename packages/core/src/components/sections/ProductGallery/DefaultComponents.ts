import {
  Button as UIButton,
  Icon as UIIcon,
  LinkButton as UILinkButton,
  Skeleton as UISkeleton,
} from '@faststore/ui'

import dynamic from 'next/dynamic'

const ProductCard = dynamic(
  () =>
    /* webpackChunkName: "ProductCard" */
    import('src/components/product/ProductCard')
)
const EmptyGallery = dynamic(
  () =>
    /* webpackChunkName: "EmptyGallery" */
    import('./EmptyGallery')
)
const FilterDesktop = dynamic(
  () =>
    /* webpackChunkName: "FilterDesktop" */
    import('src/components/search/Filter/FilterDesktop')
)
const FilterSlider = dynamic(
  () =>
    /* webpackChunkName: "FilterSlider" */
    import('src/components/search/Filter/FilterSlider')
)
export const ProductGalleryDefaultComponents = {
  MobileFilterButton: UIButton,
  FilterIcon: UIIcon,
  PrevIcon: UIIcon,
  ResultsCountSkeleton: UISkeleton,
  SortSkeleton: UISkeleton,
  FilterButtonSkeleton: UISkeleton,
  LinkButtonPrev: UILinkButton,
  LinkButtonNext: UILinkButton,
  __experimentalFilterDesktop: FilterDesktop,
  __experimentalFilterSlider: FilterSlider,
  __experimentalProductCard: ProductCard,
  __experimentalEmptyGallery: EmptyGallery,
} as const
