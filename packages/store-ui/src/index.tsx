/**
 * VTEX Store Components
 *
 * Components to create a store with default layout
 */

// All components and styles from Theme UI
export * from 'theme-ui'
// Merge Theme
export * from './createTheme'
// Header
export * from './Header'
export * from './Header/theme'
// Logo
export * from './Logo'
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
// RichMarkdown
export { default as RichMarkdown } from './RichMarkdown'
// Base Theme
export * from './theme'
// LocalizedLink
export { default as LocalizedLink } from './LocalizedLink'