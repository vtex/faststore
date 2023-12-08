import { lazy } from 'react'
import {
  Button as UIButton,
  LinkButton as UILinkButton,
  Skeleton as UISkeleton,
  Icon as UIIcon,
} from '@faststore/ui'

import ProductCard from 'src/components/product/ProductCard'
import FilterDesktop from 'src/components/search/Filter/FilterDesktop'
import EmptyGallery from './EmptyGallery'

const FilterSlider = lazy(
  () => import('src/components/search/Filter/FilterSlider')
)

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/ProductGallery'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

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
  __experimentalEmptyGallery,
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
    __experimentalEmptyGallery: EmptyGallery,
  },
  override as SectionOverrideDefinition<'ProductGallery'>
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
  __experimentalEmptyGallery,
}
