import {
  ProductTitle as UIProductTitle,
  DiscountBadge as UIDiscountBadge,
  BuyButton as UIBuyButton,
  SkuSelector as UISkuSelector,
  ShippingSimulation as UIShippingSimulation,
  Icon as UIIcon,
  Price as UIPrice,
  QuantitySelector as UIQuantitySelector,
  ImageZoom as UIImageZoom,
  ImageGallery as UIImageGallery,
} from '@faststore/ui'

import type {
  ProductTitleProps,
  ButtonProps,
  DiscountBadgeProps,
  IconProps,
  ImageGalleryProps,
  ImageZoomProps,
  PriceProps,
  QuantitySelectorProps,
  ShippingSimulationProps,
  SkuSelectorProps,
} from '@faststore/ui'

import LocalImageGallery from 'src/components/ui/ImageGallery'
import LocalShippingSimulation from 'src/components/ui/ShippingSimulation/ShippingSimulation'
import { Image } from 'src/components/ui/Image'

import { getSectionOverrides } from 'src/utils/overrides'
import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinition,
} from 'src/typings/overrides'
import { override } from 'src/customizations/components/overrides/ProductDetails'

export type ProductDetailsOverrideDefinition = SectionOverrideDefinition<
  'ProductDetails',
  {
    ProductTitle: ComponentOverrideDefinition<
      ProductTitleProps,
      ProductTitleProps
    >
    DiscountBadge: ComponentOverrideDefinition<
      DiscountBadgeProps,
      Omit<DiscountBadgeProps, 'listPrice' | 'spotPrice'>
    >
    BuyButton: ComponentOverrideDefinition<ButtonProps, ButtonProps>
    Icon: ComponentOverrideDefinition<IconProps, IconProps>
    Price: ComponentOverrideDefinition<
      PriceProps,
      Omit<PriceProps, 'value' | 'data-value'>
    >
    QuantitySelector: ComponentOverrideDefinition<
      QuantitySelectorProps,
      Omit<QuantitySelectorProps, 'onChange'>
    >
    SkuSelector: ComponentOverrideDefinition<SkuSelectorProps, SkuSelectorProps>
    ShippingSimulation: ComponentOverrideDefinition<
      ShippingSimulationProps,
      ShippingSimulationProps
    >
    ImageGallery: ComponentOverrideDefinition<
      ImageGalleryProps,
      ImageGalleryProps
    >
    ImageZoom: ComponentOverrideDefinition<ImageZoomProps, ImageZoomProps>
    __experimentalImageGalleryImage: ComponentOverrideDefinition<any, any>
    __experimentalImageGallery: ComponentOverrideDefinition<any, any>
    __experimentalShippingSimulation: ComponentOverrideDefinition<any, any>
  }
>

const {
  ProductTitle,
  DiscountBadge,
  BuyButton,
  Icon,
  Price,
  QuantitySelector,
  SkuSelector,
  ShippingSimulation,
  ImageGallery,
  ImageZoom,
  __experimentalImageGalleryImage,
  __experimentalImageGallery,
  __experimentalShippingSimulation,
} = getSectionOverrides(
  {
    ProductTitle: UIProductTitle,
    DiscountBadge: UIDiscountBadge,
    BuyButton: UIBuyButton,
    Icon: UIIcon,
    Price: UIPrice,
    QuantitySelector: UIQuantitySelector,
    SkuSelector: UISkuSelector,
    ShippingSimulation: UIShippingSimulation,
    ImageGallery: UIImageGallery,
    ImageZoom: UIImageZoom,
    __experimentalImageGalleryImage: Image,
    __experimentalImageGallery: LocalImageGallery,
    __experimentalShippingSimulation: LocalShippingSimulation,
  },
  override as ProductDetailsOverrideDefinition
)

export {
  ProductTitle,
  DiscountBadge,
  BuyButton,
  Icon,
  Price,
  QuantitySelector,
  SkuSelector,
  ShippingSimulation,
  ImageGallery,
  ImageZoom,
  __experimentalImageGalleryImage,
  __experimentalImageGallery,
  __experimentalShippingSimulation,
}
