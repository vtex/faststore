import type { PropsWithChildren } from 'react'
import type {
  AlertProps,
  BannerTextContentProps,
  BannerTextProps,
  BreadcrumbProps,
  ButtonProps,
  DiscountBadgeProps,
  EmptyStateProps,
  HeroHeaderProps,
  HeroImageProps,
  HeroProps,
  IconButtonProps,
  IconProps,
  ImageGalleryProps,
  ImageGalleryViewerProps,
  InputFieldProps,
  LinkButtonProps,
  NavbarButtonsProps,
  NavbarHeaderProps,
  NavbarLinksListProps,
  NavbarLinksProps,
  NavbarProps,
  NavbarRowProps,
  NavbarSliderContentProps,
  NavbarSliderFooterProps,
  NavbarSliderHeaderProps,
  NavbarSliderProps,
  PriceProps,
  ProductShelfProps,
  ProductTitleProps,
  QuantitySelectorProps,
  RegionBarProps,
  ShippingSimulationProps,
  SkeletonProps,
  SkuSelectorProps,
} from '@faststore/ui'

import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinitionV1,
} from './overridesDefinition'
import type { NewsletterAddendumProps } from '../components/ui/Newsletter/NewsletterAddendum'
import Alert from '../components/sections/Alert'
import Breadcrumb from '../components/sections/Breadcrumb'
import BannerText from '../components/sections/BannerText'
import CrossSellingShelf from '../components/sections/CrossSellingShelf'
import Hero from '../components/sections/Hero'
import ProductShelf from '../components/sections/ProductShelf'
import ProductDetails from '../components/sections/ProductDetails'

export type SectionOverride = {
  [K in keyof SectionsOverrides]: SectionOverrideDefinitionV1<K>
}[keyof SectionsOverrides]

export type SupportedSectionsOverridesV2 = {
  Alert: typeof Alert
  BannerText: typeof BannerText
  Breadcrumb: typeof Breadcrumb
  CrossSellingShelf: typeof CrossSellingShelf
  Hero: typeof Hero
  ProductShelf: typeof ProductShelf
  ProductDetails: typeof ProductDetails
  /** TODO: the components below are put as never because they are not supported yet */
  EmptyState: never
  Navbar: never
  Newsletter: never
  ProductGallery: never
  RegionBar: never
}

/**
 * Originally, these types were defined in their respective Overrides file
 * For some reason, typescript wouldn't interpret SectionOverride correctly when
 * defining it by importing each of the SectionOverrideDefinitions and would set it as 'any'
 *
 * For some reason, defining them in the same file as SectionOverride seems to fix the issue.
 * Consider that before moving them elsewhere and test it on the starter as well.
 */

export type SectionsOverrides = {
  Alert: {
    Alert: ComponentOverrideDefinition<AlertProps, Omit<AlertProps, 'onClose'>>
    Icon: ComponentOverrideDefinition<IconProps, IconProps>
  }
  BannerText: {
    BannerText: ComponentOverrideDefinition<BannerTextProps, BannerTextProps>
    BannerTextContent: ComponentOverrideDefinition<
      BannerTextContentProps,
      BannerTextContentProps
    >
  }
  Breadcrumb: {
    Breadcrumb: ComponentOverrideDefinition<BreadcrumbProps, BreadcrumbProps>
    Icon: ComponentOverrideDefinition<IconProps, IconProps>
  }
  EmptyState: {
    EmptyState: ComponentOverrideDefinition<
      PropsWithChildren<EmptyStateProps>,
      EmptyStateProps
    >
  }
  Hero: {
    Hero: ComponentOverrideDefinition<HeroProps, HeroProps>
    HeroImage: ComponentOverrideDefinition<HeroImageProps, HeroImageProps>
    HeroHeader: ComponentOverrideDefinition<HeroHeaderProps, HeroHeaderProps>
  }
  Navbar: {
    Navbar: ComponentOverrideDefinition<NavbarProps, NavbarProps>
    NavbarLinks: ComponentOverrideDefinition<NavbarLinksProps, NavbarLinksProps>
    NavbarLinksList: ComponentOverrideDefinition<
      NavbarLinksListProps,
      NavbarLinksListProps
    >
    NavbarSlider: ComponentOverrideDefinition<
      NavbarSliderProps,
      NavbarSliderProps
    >
    NavbarSliderHeader: ComponentOverrideDefinition<
      NavbarSliderHeaderProps,
      NavbarSliderHeaderProps
    >
    NavbarSliderContent: ComponentOverrideDefinition<
      NavbarSliderContentProps,
      NavbarSliderContentProps
    >
    NavbarSliderFooter: ComponentOverrideDefinition<
      NavbarSliderFooterProps,
      NavbarSliderFooterProps
    >
    NavbarHeader: ComponentOverrideDefinition<
      NavbarHeaderProps,
      NavbarHeaderProps
    >
    NavbarRow: ComponentOverrideDefinition<NavbarRowProps, NavbarRowProps>
    NavbarButtons: ComponentOverrideDefinition<
      NavbarButtonsProps,
      NavbarButtonsProps
    >
    IconButton: ComponentOverrideDefinition<
      IconButtonProps,
      Omit<IconButtonProps, 'onClick'>
    >
  }
  Newsletter: {
    ToastIconSuccess: ComponentOverrideDefinition<IconProps, IconProps>
    ToastIconError: ComponentOverrideDefinition<IconProps, IconProps>
    HeaderIcon: ComponentOverrideDefinition<IconProps, IconProps>
    InputFieldName: ComponentOverrideDefinition<
      InputFieldProps,
      Omit<InputFieldProps, 'inputRef'>
    >
    InputFieldEmail: ComponentOverrideDefinition<
      InputFieldProps,
      Omit<InputFieldProps, 'inputRef'>
    >
    Button: ComponentOverrideDefinition<ButtonProps, ButtonProps>
    __experimentalNewsletterAddendum: ComponentOverrideDefinition<
      NewsletterAddendumProps,
      NewsletterAddendumProps
    >
  }
  ProductDetails: {
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
    ImageGalleryViewer: ComponentOverrideDefinition<
      ImageGalleryViewerProps,
      ImageGalleryViewerProps
    >
    __experimentalImageGalleryImage: ComponentOverrideDefinition<any, any>
    __experimentalImageGallery: ComponentOverrideDefinition<any, any>
    __experimentalShippingSimulation: ComponentOverrideDefinition<any, any>
    __experimentalNotAvailableButton: ComponentOverrideDefinition<any, any>
  }
  ProductGallery: {
    MobileFilterButton: ComponentOverrideDefinition<
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
    __experimentalEmptyGallery: ComponentOverrideDefinition<any, any>
  }
  ProductShelf: {
    ProductShelf: ComponentOverrideDefinition<
      ProductShelfProps,
      ProductShelfProps
    >
    __experimentalCarousel: ComponentOverrideDefinition<any, any>
    __experimentalProductCard: ComponentOverrideDefinition<
      any,
      Omit<any, 'key' | 'product' | 'index'>
    >
  }
  CrossSellingShelf: {
    ProductShelf: ComponentOverrideDefinition<
      ProductShelfProps,
      ProductShelfProps
    >
    __experimentalCarousel: ComponentOverrideDefinition<any, any>
    __experimentalProductCard: ComponentOverrideDefinition<
      any,
      Omit<any, 'key' | 'product' | 'index'>
    >
  }
  RegionBar: {
    RegionBar: ComponentOverrideDefinition<
      RegionBarProps,
      Omit<RegionBarProps, 'onButtonClick' | 'postalCode'>
    >
    LocationIcon: ComponentOverrideDefinition<IconProps, IconProps>
    ButtonIcon: ComponentOverrideDefinition<IconProps, IconProps>
  }
}
