import { lazy } from 'react'
import {
  Button as UIButton,
  LinkButton as UILinkButton,
  Skeleton as UISkeleton,
  Icon as UIIcon,
} from '@faststore/ui'

import ProductCard from 'src/components/product/ProductCard'
import FilterDesktop from 'src/components/search/Filter/FilterDesktop'

const FilterSlider = lazy(
  () => import('src/components/search/Filter/FilterSlider')
)

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/ProductGallery'
import type { ProductGalleryOverrideDefinition } from 'src/typings/overrides'

const {
  MobileFilterButton,
  FilterIcon,
  PrevIcon,
  ResultsCountSkeleton,
  SortSkeleton,
  FilterButtonSkeleton,
  LinkButtonPrev,
  LinkButtonNext,
  __experimentalFilterDesktop,
  __experimentalFilterSlider,
  __experimentalProductCard,
} = getSectionOverrides(
  {
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
  },
  override as ProductGalleryOverrideDefinition
)

export {
  MobileFilterButton,
  FilterIcon,
  PrevIcon,
  ResultsCountSkeleton,
  SortSkeleton,
  FilterButtonSkeleton,
  LinkButtonPrev,
  LinkButtonNext,
  __experimentalFilterDesktop,
  __experimentalFilterSlider,
  __experimentalProductCard,
}
