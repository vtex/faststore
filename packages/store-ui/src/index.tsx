/**
 * VTEX Store Components
 *
 * Components to create a store with default layout
 */

// All components and styles from Theme UI
export * from 'theme-ui'
export * from '@theme-ui/components'

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
// Search's sort combo box selector
export * from './SortSelect'
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
// Search Filters
export { default as FilterGroup } from './Filter/Group'
export { default as FilterSelector } from './Filter/Selector'
export { default as FilterSelectorItem } from './Filter/Selector/Item'
// RichMarkdown
export { default as RichMarkdown } from './RichMarkdown'
