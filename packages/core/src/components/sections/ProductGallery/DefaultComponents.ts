import {
  Button as UIButton,
  Icon as UIIcon,
  LinkButton as UILinkButton,
  Skeleton as UISkeleton,
  ToggleField as UIToggleField,
  ProductComparison as UIProductComparison,
  ProductComparisonSidebar as UIProductComparisonSidebar,
  ProductComparisonToolbar as UIProductComparisonToolbar,
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

const ProductComparisonSidebar = dynamic(
  () =>
    /* webpackChunkName: "ProductComparisonSidebar" */
    import('src/components/ui/ProductComparison')
)

export const ProductGalleryDefaultComponents = {
  MobileFilterButton: UIButton,
  FilterIcon: UIIcon,
  PrevIcon: UIIcon,
  ResultsCountSkeleton: UISkeleton,
  SortSkeleton: UISkeleton,
  FilterButtonSkeleton: UISkeleton,
  ToggleField: UIToggleField,
  ProductComparison: UIProductComparison,
  ProductComparisonSidebar: UIProductComparisonSidebar,
  ProductComparisonToolbar: UIProductComparisonToolbar,
  LinkButtonPrev: UILinkButton,
  LinkButtonNext: UILinkButton,
  __experimentalFilterDesktop: FilterDesktop,
  __experimentalFilterSlider: FilterSlider,
  __experimentalProductCard: ProductCard,
  __experimentalEmptyGallery: EmptyGallery,
  __experimentalProductComparisonSidebar: ProductComparisonSidebar,
} as const
