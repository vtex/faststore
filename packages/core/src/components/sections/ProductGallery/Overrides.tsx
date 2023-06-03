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

import ProductGalleryCustomizations from 'src/customizations/components/overrides/ProductGallery'

const productGalleryComponentsCustomization = {}

const productGalleryPropsCustomization = {} as any

Object.entries(ProductGalleryCustomizations.components).forEach(
  ([key, value]) => {
    if (value.Component) {
      productGalleryComponentsCustomization[key] = value.Component
    }
  }
)

Object.entries(ProductGalleryCustomizations.components).forEach(
  ([key, value]) => {
    if (value.props) {
      productGalleryPropsCustomization[key] = value.props
    }
  }
)

const Components = {
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
  ...productGalleryComponentsCustomization,
}

export { Components, productGalleryPropsCustomization as Props }
