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
  SectionOverrideDefinition,
} from './overrideDefinitionUtils'

export type SectionOverride =
  | AlertOverrideDefinition
  | BannerTextOverrideDefinition
  | BreadcrumbOverrideDefinition
  | EmptyStateOverrideDefinition
  | HeroOverrideDefinition
  | NavbarOverrideDefinition
  | NewsletterOverrideDefinition
  | ProductDetailsOverrideDefinition
  | ProductGalleryOverrideDefinition
  | ProductShelfOverrideDefinition
  | RegionBarOverrideDefinition

/**
 * Originally, these types were defined in their respective Overrides file
 * For some reason, typescript wouldn't interpret SectionOverride correctly when
 * defining it by importing each of the SectionOverrideDefinitions and would set it as 'any'
 *
 * For some reason, defining them in the same file as SectionOverride seems to fix the issue.
 * Consider that before moving them elsewhere and test it on the starter as well.
 */
export type AlertOverrideDefinition = SectionOverrideDefinition<
  'Alert',
  {
    Alert: ComponentOverrideDefinition<AlertProps, Omit<AlertProps, 'onClose'>>
    Icon: ComponentOverrideDefinition<IconProps, IconProps>
  }
>

export type BannerTextOverrideDefinition = SectionOverrideDefinition<
  'BannerText',
  {
    BannerText: ComponentOverrideDefinition<BannerTextProps, BannerTextProps>
    BannerTextContent: ComponentOverrideDefinition<
      BannerTextContentProps,
      BannerTextContentProps
    >
  }
>

export type BreadcrumbOverrideDefinition = SectionOverrideDefinition<
  'Breadcrumb',
  {
    Breadcrumb: ComponentOverrideDefinition<BreadcrumbProps, BreadcrumbProps>
    Icon: ComponentOverrideDefinition<IconProps, IconProps>
  }
>

export type EmptyStateOverrideDefinition = SectionOverrideDefinition<
  'EmptyState',
  {
    EmptyState: ComponentOverrideDefinition<
      PropsWithChildren<EmptyStateProps>,
      EmptyStateProps
    >
  }
>

export type HeroOverrideDefinition = SectionOverrideDefinition<
  'Hero',
  {
    Hero: ComponentOverrideDefinition<HeroProps, HeroProps>
    HeroImage: ComponentOverrideDefinition<HeroImageProps, HeroImageProps>
    HeroHeader: ComponentOverrideDefinition<HeroHeaderProps, HeroHeaderProps>
  }
>

export type NavbarOverrideDefinition = SectionOverrideDefinition<
  'Navbar',
  {
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
>

export type NewsletterOverrideDefinition = SectionOverrideDefinition<
  'Newsletter',
  {
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
  }
>

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
    ImageGalleryViewer: ComponentOverrideDefinition<
      ImageGalleryViewerProps,
      ImageGalleryViewerProps
    >
    __experimentalImageGalleryImage: ComponentOverrideDefinition<any, any>
    __experimentalImageGallery: ComponentOverrideDefinition<any, any>
    __experimentalShippingSimulation: ComponentOverrideDefinition<any, any>
  }
>

export type ProductGalleryOverrideDefinition = SectionOverrideDefinition<
  'ProductGallery',
  {
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
  }
>

export type ProductShelfOverrideDefinition = SectionOverrideDefinition<
  'ProductShelf',
  {
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
>

export type RegionBarOverrideDefinition = SectionOverrideDefinition<
  'RegionBar',
  {
    RegionBar: ComponentOverrideDefinition<
      RegionBarProps,
      Omit<RegionBarProps, 'onButtonClick' | 'postalCode'>
    >
    LocationIcon: ComponentOverrideDefinition<IconProps, IconProps>
    ButtonIcon: ComponentOverrideDefinition<IconProps, IconProps>
  }
>
