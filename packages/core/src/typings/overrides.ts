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
  NewsletterProps,
  NewsletterAddendumProps,
  NewsletterContentProps,
  NewsletterFormProps,
  NewsletterHeaderProps,
  ProductPriceProps,
  ProductShelfProps,
  ProductTitleProps,
  QuantitySelectorProps,
  RegionBarProps,
  ShippingSimulationProps,
  SkeletonProps,
  SkuSelectorProps,
  SKUMatrixProps,
  SKUMatrixTriggerProps,
  SKUMatrixSidebarProps,
  RatingSummaryProps,
} from '@faststore/ui'

import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinitionV1,
} from './overridesDefinition'
import type Alert from '../components/sections/Alert'
import type Breadcrumb from '../components/sections/Breadcrumb'
import type BannerText from '../components/sections/BannerText'
import type CrossSellingShelf from '../components/sections/CrossSellingShelf'
import type ReviewsAndRatings from '../components/sections/ReviewsAndRatings'
import type EmptyState from '../components/sections/EmptyState'
import type Hero from '../components/sections/Hero'
import type ProductShelf from '../components/sections/ProductShelf'
import type ProductDetails from '../components/sections/ProductDetails'
import type Navbar from '../components/sections/Navbar'
import type Newsletter from '../components/sections/Newsletter'
import type ProductGallery from '../components/sections/ProductGallery'
import type RegionBar from '../components/sections/RegionBar'

export type SectionOverride = {
  [K in keyof SectionsOverrides]: SectionOverrideDefinitionV1<K>
}[keyof SectionsOverrides]

/**
 * This type exists for us to be able to provide proper autocomplete
 * and type checking for the override components.
 *
 * What it does is it maps a section component to its override components.
 *
 * OverrideComponentsForSection<typeof Alert> translates to:
 * {
 *  Alert: {
 *   Alert: ComponentOverrideDefinition<AlertProps, Omit<AlertProps, 'onClose'>>
 *   Icon: ComponentOverrideDefinition<IconProps, IconProps>
 *  }
 * }
 *
 * We then use ComponentsFromSection to extract the list of components
 */
export type OverrideComponentsForSection<
  Section extends SectionsOverrides[keyof SectionsOverrides]['Section'],
> = {
  // The first 'extends' condition is used to filter out sections that don't have overrides (typed 'never')
  [K in keyof SectionsOverrides as SectionsOverrides[K] extends {
    Section: never
  }
    ? never
    : // In the second 'extends' condition, we check if the section matches the one we're looking for
      SectionsOverrides[K] extends {
          Section: Section
        }
      ? // If it does, we return the components. Otherwise, we return 'never', which is filtered out
        K
      : never]: SectionsOverrides[K]['components']
}

// This type is used to extract only the list of components from the section override
export type ComponentsFromSection<
  Section extends SectionsOverrides[keyof SectionsOverrides]['Section'],
> =
  OverrideComponentsForSection<Section>[keyof OverrideComponentsForSection<Section>]

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
    Section: typeof Alert
    components: {
      Alert: ComponentOverrideDefinition<
        AlertProps,
        Omit<AlertProps, 'onClose'>
      >
      Icon: ComponentOverrideDefinition<IconProps, IconProps>
    }
  }
  BannerText: {
    Section: typeof BannerText
    components: {
      BannerText: ComponentOverrideDefinition<BannerTextProps, BannerTextProps>
      BannerTextContent: ComponentOverrideDefinition<
        BannerTextContentProps,
        BannerTextContentProps
      >
    }
  }
  Breadcrumb: {
    Section: typeof Breadcrumb
    components: {
      Breadcrumb: ComponentOverrideDefinition<BreadcrumbProps, BreadcrumbProps>
      Icon: ComponentOverrideDefinition<IconProps, IconProps>
    }
  }
  EmptyState: {
    Section: typeof EmptyState
    components: {
      EmptyState: ComponentOverrideDefinition<
        PropsWithChildren<EmptyStateProps>,
        EmptyStateProps
      >
    }
  }
  Hero: {
    Section: typeof Hero
    components: {
      Hero: ComponentOverrideDefinition<HeroProps, HeroProps>
      HeroImage: ComponentOverrideDefinition<HeroImageProps, HeroImageProps>
      HeroHeader: ComponentOverrideDefinition<HeroHeaderProps, HeroHeaderProps>
    }
  }
  Navbar: {
    Section: typeof Navbar
    components: {
      Navbar: ComponentOverrideDefinition<NavbarProps, NavbarProps>
      NavbarLinks: ComponentOverrideDefinition<
        NavbarLinksProps,
        NavbarLinksProps
      >
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
      _experimentalButtonSignIn: ComponentOverrideDefinition<any, any>
    }
  }
  Newsletter: {
    Section: typeof Newsletter
    components: {
      Newsletter: ComponentOverrideDefinition<NewsletterProps, NewsletterProps>
      NewsletterAddendum: ComponentOverrideDefinition<
        NewsletterAddendumProps,
        NewsletterAddendumProps
      >
      NewsletterContent: ComponentOverrideDefinition<
        NewsletterContentProps,
        NewsletterContentProps
      >
      NewsletterForm: ComponentOverrideDefinition<
        NewsletterFormProps,
        NewsletterFormProps
      >
      NewsletterHeader: ComponentOverrideDefinition<
        NewsletterHeaderProps,
        NewsletterHeaderProps
      >
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
  }
  ProductDetails: {
    Section: typeof ProductDetails
    components: {
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
      ProductPrice: ComponentOverrideDefinition<
        ProductPriceProps,
        Omit<ProductPriceProps, 'value'>
      >
      QuantitySelector: ComponentOverrideDefinition<
        QuantitySelectorProps,
        Omit<QuantitySelectorProps, 'onChange'>
      >
      SkuSelector: ComponentOverrideDefinition<
        SkuSelectorProps,
        SkuSelectorProps
      >
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
      SKUMatrix: ComponentOverrideDefinition<SKUMatrixProps, SKUMatrixProps>
      SKUMatrixTrigger: ComponentOverrideDefinition<
        SKUMatrixTriggerProps,
        SKUMatrixTriggerProps
      >
      SKUMatrixSidebar: ComponentOverrideDefinition<
        SKUMatrixSidebarProps,
        SKUMatrixSidebarProps
      >
      __experimentalImageGalleryImage: ComponentOverrideDefinition<any, any>
      __experimentalImageGallery: ComponentOverrideDefinition<any, any>
      __experimentalShippingSimulation: ComponentOverrideDefinition<any, any>
      __experimentalNotAvailableButton: ComponentOverrideDefinition<any, any>
      __experimentalProductDescription: ComponentOverrideDefinition<any, any>
      __experimentalSKUMatrixSidebar: ComponentOverrideDefinition<any, any>
      __experimentalProductDetailsSettings: ComponentOverrideDefinition<
        any,
        any
      >
    }
  }
  ProductGallery: {
    Section: typeof ProductGallery
    components: {
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
  }
  ProductShelf: {
    Section: typeof ProductShelf
    components: {
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
  }
  CrossSellingShelf: {
    Section: typeof CrossSellingShelf
    components: {
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
  }
  ReviewsAndRatings: {
    Section: typeof ReviewsAndRatings
    // TODO: Add components
    components: {
      RatingSummary: ComponentOverrideDefinition<
        RatingSummaryProps,
        RatingSummaryProps
      >
      __experimentalRatingSummarySkeleton: ComponentOverrideDefinition<any, any>
      __experimentalReviewModal: ComponentOverrideDefinition<any, any>
    }
  }
  RegionBar: {
    Section: typeof RegionBar
    components: {
      RegionBar: ComponentOverrideDefinition<
        RegionBarProps,
        Omit<RegionBarProps, 'onButtonClick' | 'postalCode'>
      >
      LocationIcon: ComponentOverrideDefinition<IconProps, IconProps>
      ButtonIcon: ComponentOverrideDefinition<IconProps, IconProps>
    }
  }
}
