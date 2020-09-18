/**
 * VTEX Store Components
 *
 * Components to create a store with default layout
 */

// All components and styles from Theme UI
export * from 'theme-ui'

// Base components from @vtex-components
// Drawer
export { default as Drawer } from '@vtex-components/drawer'

// Utils
// Merge Theme
export * from './createTheme'
// Base Theme
export * from './theme'

// Local Components
// Header
export * from './Header'
export * from './Header/theme'
// Logo
export * from './Logo'
// ProgressiveImage
export { default as ProgressiveImage } from './ProgressiveImage'
// ResponsiveImage
export {
  default as ResponsiveImage,
  IResponsiveImage,
  IResponsiveImageSource,
} from './ResponsiveImage/index'
// InfoCard
export { default as InfoCard } from './InfoCard'
export { default as InfoCardImage } from './InfoCard/Image'
export { default as InfoCardInfo } from './InfoCard/Info'
export { default as InfoCardInfoAction } from './InfoCard/InfoAction'
export { default as infoCardTheme } from './InfoCard/theme'
// Minicart
export * from './Minicart/Badge'
export * from './Minicart/Button'
export * from './Minicart/Content'
export * from './Minicart/Drawer'
export * from './Minicart/Svg'
export * from './Minicart/theme'
// LocalizedLink
export { default as LocalizedLink } from './LocalizedLink'
// Banner
export { default as Banner } from './Banner'
// RichMarkdown
export { default as RichMarkdown } from './RichMarkdown'
// Search Filters
export * from './SearchFilter/Accordion'
export * from './SearchFilter/AccordionItemCheckbox'
export * from './SearchFilter/theme'
// Search Controls
export * from './SearchControls'
export * from './SearchControls/FiltersButton'
export * from './SearchControls/totalCount'
export * from './SearchControls/Select'
export * from './SearchControls/theme'
// Breadcrumb
export * from './Breadcrumb'
export { default as breadcrumbTheme } from './Breadcrumb/theme'
// Slider
export * from './Slider/PaginationDots'
export * from './Slider/hooks/useInterval'
export * from './Slider/hooks/useSlider'
export * from './Slider/hooks/useResponsiveSlider'
// Popover
export * from 'reakit/Popover'
// Centered
export { default as Center } from './Center'
// Product Specification
export * from './ProductSpecification'
// Product Description
export * from './ProductDescription'
// Offer
export { default as OfferPrice } from './Offer/Price'
export { default as OfferSoldOut } from './Offer/SoldOut'
export { default as OfferListPrice } from './Offer/ListPrice'
export { default as OfferContainer } from './Offer/Container'
export { default as OfferInstallments } from './Offer/Installments'
export { default as OfferDiscountBadge } from './Offer/DiscountBadge'
// Product Summary
export { default as ProductSummaryImage } from './ProductSummary/Image'
export { default as ProductSummaryTitle } from './ProductSummary/Title'
export { default as ProductSummaryContainer } from './ProductSummary/Container'
// Product Details
export { default as ProductDetailsImage } from './ProductDetails/Image'
export { default as ProductDetailsTitle } from './ProductDetails/Title'
export { default as ProductDetailsGallery } from './ProductDetails/Gallery'
export { default as ProductDetailsReference } from './ProductDetails/Reference'
// Floating Action Button
export * from './FloatingActionButton'
