---
name: faststore-sections
description: Complete catalog of all built-in FastStore global sections and their overridable component slots. Use when looking up which native sections are available, which inner components (slots) within a section can be overridden via getOverriddenSection, or when deciding whether to override an existing section or create a new one.
metadata:
  author: vtex
  version: "1.0"
---

# FastStore Global Sections Catalog

These sections are included by default in every FastStore project. Use `getOverriddenSection` from `@faststore/core` to override any of their inner component slots.

See [faststore-overrides](../faststore-overrides/SKILL.md) for override implementation patterns.

## Available Global Sections

- Alert
- BannerText
- Breadcrumb
- CrossSellingShelf
- EmptyState
- Hero
- Navbar
- Newsletter
- ProductDetails
- ProductGallery
- ProductShelf
- RegionBar
- Search
- Footer
- Incentives
- ProductTiles
- Children
- BannerNewsletter
- CartSidebar
- RegionModal
- RegionPopover

## Sections and Their Overridable Component Slots

### Alert
- `Alert`
- `Icon`

### BannerText
- `BannerText`
- `BannerTextContent`

### Breadcrumb
- `Breadcrumb`
- `Icon`

### CrossSellingShelf
- `ProductShelf`
- `__experimentalCarousel`
- `__experimentalProductCard`

### EmptyState
- `EmptyState`

### Hero
- `Hero`
- `HeroImage`
- `HeroHeader`

### Navbar
- `Navbar`
- `NavbarLinks`
- `NavbarLinksList`
- `NavbarSlider`
- `NavbarSliderHeader`
- `NavbarSliderContent`
- `NavbarSliderFooter`
- `NavbarHeader`
- `NavbarRow`
- `NavbarButtons`
- `IconButton`
- `_experimentalButtonSignIn`
- `__experimentalSKUMatrixSidebar`

### Newsletter
- `Button`
- `HeaderIcon`
- `InputFieldEmail`
- `InputFieldName`
- `Newsletter`
- `NewsletterAddendum`
- `NewsletterContent`
- `NewsletterForm`
- `NewsletterHeader`
- `ToastIconError`
- `ToastIconSuccess`

### ProductDetails
- `ProductTitle`
- `DiscountBadge`
- `BuyButton`
- `Icon`
- `ProductPrice`
- `QuantitySelector`
- `SkuSelector`
- `ShippingSimulation`
- `ImageGallery`
- `ImageGalleryViewer`
- `SKUMatrix`
- `SKUMatrixTrigger`
- `SKUMatrixSidebar`
- `__experimentalImageGalleryImage`
- `__experimentalImageGallery`
- `__experimentalShippingSimulation`
- `__experimentalSKUMatrixSidebar`
- `__experimentalNotAvailableButton`
- `__experimentalProductDescription`
- `__experimentalProductDetailsSettings`

### ProductGallery
- `MobileFilterButton`
- `FilterIcon`
- `PrevIcon`
- `ResultsCountSkeleton`
- `SortSkeleton`
- `FilterButtonSkeleton`
- `ToggleField`
- `ProductComparison`
- `ProductComparisonSidebar`
- `ProductComparisonToolbar`
- `LinkButtonPrev`
- `LinkButtonNext`
- `__experimentalFilterDesktop`
- `__experimentalFilterSlider`
- `__experimentalProductCard`
- `__experimentalEmptyGallery`
- `__experimentalProductComparisonSidebar`

> **Note:** Overriding `__experimentalFilterDesktop` or `__experimentalFilterSlider` makes your component fully responsible for the filter/search feature implementation.

### ProductShelf
- `ProductShelf`
- `__experimentalCarousel`
- `__experimentalProductCard`

### RegionBar
- `RegionBar`
- `LocationIcon`
- `ButtonIcon`
- `FilterButtonIcon`
