import { lazy } from 'react'
import {
  Button as UIButton,
  LinkButton as UILinkButton,
  Skeleton as UISkeleton,
  Icon as UIIcon,
} from '@faststore/ui'

import type {
  ButtonProps,
  IconProps,
  LinkButtonProps,
  SkeletonProps,
} from '@faststore/ui'

import ProductCard from 'src/components/product/ProductCard'
import FilterDesktop from 'src/components/search/Filter/FilterDesktop'

const FilterSlider = lazy(
  () => import('src/components/search/Filter/FilterSlider')
)

import type {
  SectionOverrideDefinition,
  ComponentOverrideDefinition,
} from 'src/typings/overrides'
import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/ProductGallery'

export type ProductGalleryOverrideDefinition = SectionOverrideDefinition<
  'ProductGallery',
  {
    Button: ComponentOverrideDefinition<
      ButtonProps,
      Omit<ButtonProps, 'onClick'>
    >
    FilterIcon: ComponentOverrideDefinition<IconProps, IconProps>
    PrevIcon: ComponentOverrideDefinition<IconProps, IconProps>
    ResultsCountSkeleton: ComponentOverrideDefinition<
      SkeletonProps,
      Omit<SkeletonProps, 'loading'>
    >
    SortSkeleton: ComponentOverrideDefinition<
      SkeletonProps,
      Omit<SkeletonProps, 'loading'>
    >
    FilterButtonSkeleton: ComponentOverrideDefinition<
      SkeletonProps,
      Omit<SkeletonProps, 'loading'>
    >
    LinkButtonPrev: ComponentOverrideDefinition<
      LinkButtonProps,
      Omit<LinkButtonProps, 'onClick' | 'href'>
    >
    LinkButtonNext: ComponentOverrideDefinition<
      LinkButtonProps,
      Omit<LinkButtonProps, 'onClick' | 'href'>
    >
    __experimentalFilterDesktop: ComponentOverrideDefinition<any, any>
    __experimentalFilterSlider: ComponentOverrideDefinition<any, any>
    __experimentalProductCard: ComponentOverrideDefinition<any, any>
  }
>

const {
  Button,
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
    Button: UIButton,
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
  Button,
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
