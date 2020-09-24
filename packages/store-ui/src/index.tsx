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
export * from './ProgressiveImage'
// ResponsiveImage
export * from './ResponsiveImage'
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
export * from './ProductSpecification/theme'
