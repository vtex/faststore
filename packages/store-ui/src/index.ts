/**
 * VTEX Store Components
 *
 * Components to create a store with default layout
 */

// All components and styles from Theme UI
export {
  Box,
  Flex,
  Grid,
  Button as UIButton,
  Link,
  Heading,
  Image,
  Card,
  Label,
  Input as UIInput,
  Select,
  Textarea,
  Text,
  Radio,
  Checkbox,
  Slider,
  Field,
  Progress,
  Donut,
  Avatar,
  Badge,
  Close,
  Alert,
  Divider,
  Embed,
  AspectRatio,
  AspectImage,
  Container,
  NavLink,
  Message,
  IconButton,
  MenuButton,
  jsx,
  useThemeUI,
} from 'theme-ui'

export type {
  SxStyleProp,
  BoxProps,
  FlexProps,
  GridProps,
  ButtonProps as UIButtonProps,
  LinkProps,
  HeadingProps,
  ImageProps,
  CardProps,
  LabelProps,
  InputProps as UIInputProps,
  SelectProps,
  TextareaProps,
  TextProps,
  RadioProps,
  CheckboxProps,
  SliderProps,
  ProgressProps,
  DonutProps,
  AvatarProps,
  BadgeProps,
  AlertProps,
  DividerProps,
  EmbedProps,
  AspectRatioProps,
  AspectImageProps,
  ContainerProps,
  NavLinkProps,
  MessageProps,
  IconButtonProps,
  MenuButtonProps,
} from 'theme-ui'

// All atomic components
// Atoms
export { default as Button, ButtonProps } from './atoms/Button'
export { default as Input, InputProps } from './atoms/Input'
export { default as Icon, IconProps } from './atoms/Icon'
export { default as Popover, PopoverProps } from './atoms/Popover'
// Molecules
export {
  default as SearchInput,
  SearchInputProps,
} from './molecules/SearchInput'

// The default Spinner from theme-ui, at the time of writing,
// is under-performant in terms of CPU usage
// https://github.com/vtex/faststore/pull/558
export { default as Spinner } from './deprecated/Spinner'

// Base components from @vtex-components
// Drawer
export { default as Drawer } from '@vtex-components/drawer'

// Utils
// Merge Theme
export { createTheme } from './deprecated/createTheme'
// Base Theme
export { baseTheme } from './deprecated/theme'

// throttle and debounce
export { default as throttle } from './deprecated/utils/throttle'
export { default as debounce } from './deprecated/utils/debounce'

// Local Components
// Header
export * from './deprecated/Header'
export * from './deprecated/Header/theme'
// Logo
export * from './deprecated/Logo'
// ProgressiveLoader
export { default as ProgressiveImage } from './deprecated/ProgressiveImage'
// ResponsivePicture
export { default as ResponsivePicture } from './deprecated/ResponsivePicture'
export { default as responsivePictureTheme } from './deprecated/ResponsivePicture/theme'
// InfoCard
export { default as InfoCard } from './deprecated/InfoCard'
export { default as InfoCardImage } from './deprecated/InfoCard/Image'
export { default as InfoCardInfo } from './deprecated/InfoCard/Info'
export { default as InfoCardInfoAction } from './deprecated/InfoCard/InfoAction'
export { default as infoCardTheme } from './deprecated/InfoCard/theme'
// LocalizedLink
export { default as LocalizedLink } from './deprecated/LocalizedLink'
// Banner
export { default as Banner } from './deprecated/Banner'
// RichMarkdown
export { default as RichMarkdown } from './deprecated/RichMarkdown'
// RichText
export { default as RichText } from './deprecated/RichText'
// Search Filters
export {
  default as SearchFilterAccordion,
  SearchFilterItem,
} from './deprecated/SearchFilter/Accordion'
export { default as SearchFilterAccordionItemCheckbox } from './deprecated/SearchFilter/AccordionItemCheckbox'
export { default as SearchFilterAccordionItemSlider } from './deprecated/SearchFilter/AccordionItemSlider'
export * from './deprecated/SearchFilter/theme'
// Search Controls
export * from './deprecated/SearchControls'
export * from './deprecated/SearchControls/FiltersButton'
export * from './deprecated/SearchControls/totalCount'
export * from './deprecated/SearchControls/Select'
export * from './deprecated/SearchControls/theme'
// Shelf
export { default as ShelfArrowLeft } from './deprecated/Shelf/ArrowLeft'
export { default as ShelfArrowRight } from './deprecated/Shelf/ArrowRight'
export { default as ShelfContainer } from './deprecated/Shelf/Container'
export { default as ShelfPaginationDots } from './deprecated/Shelf/PaginationDots'
export { default as ShelfTitle } from './deprecated/Shelf/Title'
export { default as ShelfPage } from './deprecated/Shelf/Page'
export { default as Shelf } from './deprecated/Shelf'
export { default as shelfTheme } from './deprecated/Shelf/theme'
// Breadcrumb
export * from './deprecated/Breadcrumb'
export { default as breadcrumbTheme } from './deprecated/Breadcrumb/theme'
// Slider
export { default as SliderPaginationDots } from './deprecated/Slider/PaginationDots'
export { default as SliderArrowLeft } from './deprecated/Slider/ArrowLeft'
export { default as SliderArrowRight } from './deprecated/Slider/ArrowRight'
export * from './deprecated/Slider/hooks/useSlider'
export * from './deprecated/Slider/hooks/useResponsiveSlider'
// Centered
export { default as Center } from './deprecated/Center'
// Product Specification
export * from './deprecated/ProductSpecification'
// Product Description
export * from './deprecated/ProductDescription'
// Product Quantity
export * from './deprecated/ProductQuantity'
// Offer
export { default as OfferPrice } from './deprecated/Offer/Price'
export { default as OfferSoldOut } from './deprecated/Offer/SoldOut'
export { default as OfferListPrice } from './deprecated/Offer/ListPrice'
export { default as OfferContainer } from './deprecated/Offer/Container'
export { default as OfferInstallments } from './deprecated/Offer/Installments'
export { default as OfferDiscountBadge } from './deprecated/Offer/DiscountBadge'
// Product Summary
export { default as ProductSummaryImage } from './deprecated/ProductSummary/Image'
export { default as ProductSummaryTitle } from './deprecated/ProductSummary/Title'
export { default as ProductSummaryContainer } from './deprecated/ProductSummary/Container'
// Product Details
export { default as ProductDetailsTitle } from './deprecated/ProductDetails/Title'
export { default as ProductDetailsGallery } from './deprecated/ProductDetails/Gallery'
export { default as ProductDetailsReference } from './deprecated/ProductDetails/Reference'
// Floating Action Button
export { default as FloatingActionButton } from './deprecated/FloatingActionButton'
export { default as floatingActionButtonTheme } from './deprecated/FloatingActionButton/theme'
// GiftList
export { default as GiftList } from './deprecated/GiftList/index'
export { default as GiftListTitle } from './deprecated/GiftList/Title'
export { default as GiftListList } from './deprecated/GiftList/List'
// Skeleton
export { default as Skeleton } from './deprecated/Skeleton'
// videoIframe
export { default as YoutubeIframe } from './deprecated/Youtube/Iframe'
export { default as YoutubeThumb } from './deprecated/Youtube/Thumb'
export * from './deprecated/Youtube/hooks'
// Carousel
export { default as Carousel } from './deprecated/Carousel'
export { default as CarouselPage } from './deprecated/Carousel/Page'
export { default as CarouselArrowLeft } from './deprecated/Carousel/ArrowLeft'
export { default as CarouselArrowRight } from './deprecated/Carousel/ArrowRight'
export { default as CarouselPaginationDots } from './deprecated/Carousel/PaginationDots'

// ShippingSimulator
export { default as ShippingSimulator } from './deprecated/ShippingSimulator'
export { default as shippingSimulatorI18nPT } from './deprecated/ShippingSimulator/i18n/pt'
export { default as shippingSimulatorI18nEN } from './deprecated/ShippingSimulator/i18n/en'

// Auth Providers
export * from './deprecated/Auth/Providers'
// Search Bar
export { default as SearchBar } from './deprecated/SearchBar'
export { default as SearchBarButton } from './deprecated/SearchBar/Button'
export { default as SearchBarContainer } from './deprecated/SearchBar/Container'
export { default as SearchBarInput } from './deprecated/SearchBar/Input'
export { default as searchBarTheme } from './deprecated/SearchBar/theme'
export {
  default as SearchBarProvider,
  SearchBarContext,
} from './deprecated/SearchBar/hooks/Provider'
export { useSearchBarContext } from './deprecated/SearchBar/hooks/useSearchBarContext'
export type { ISearchContext } from './deprecated/SearchBar/hooks/Provider'
// Login
export { default as LoginLogo } from './deprecated/Login/Logo'
export { default as loginTheme } from './deprecated/Login/theme'
// Dialog
export * from 'reakit/Dialog'
// Portal
export * from 'reakit/Portal'
// Tooltip
export * from 'reakit/Tooltip'

// Toast
export { default as Toast } from './deprecated/Toast'
export { default as toastTheme } from './deprecated/Toast/theme'

// Suspense
export { default as SuspenseDevice } from './deprecated/Suspense/Device'
export { default as SuspenseSSR } from './deprecated/Suspense/SSR'
export { default as SuspenseViewport } from './deprecated/Suspense/Viewport'
export { useIdleEffect } from './deprecated/Suspense/hooks/useIdleEffect'
export { useDevice } from './deprecated/Suspense/hooks/useDevice'

// Product Image Gallery
export { default as ProductImageGallery } from './deprecated/ProductImageGallery'
export { default as ProductImageGalleryArrowLeft } from './deprecated/ProductImageGallery/ArrowLeft'
export { default as ProductImageGalleryArrowRight } from './deprecated/ProductImageGallery/ArrowRight'
export { default as ProductImageGalleryPage } from './deprecated/ProductImageGallery/Page'
export { default as ProductImageGalleryPaginationDots } from './deprecated/ProductImageGallery/PaginationDots'
export { default as ProductImageGalleryMiniatures } from './deprecated/ProductImageGallery/Miniatures'
export { default as ProductImageGalleryMiniaturesContainer } from './deprecated/ProductImageGallery/Miniatures/Container'
export { productImageGalleryTheme } from './deprecated/ProductImageGallery/theme'

// Minicart
export { default as MinicartDrawer } from './deprecated/Minicart/Drawer'
export { default as MinicartDrawerHeader } from './deprecated/Minicart/Drawer/Header'
export { default as MinicartDrawerHeaderCloseButton } from './deprecated/Minicart/Drawer/Header/CloseButton'
export { default as MinicartDrawerFooter } from './deprecated/Minicart/Drawer/Footer'
export { default as MinicartDrawerContent } from './deprecated/Minicart/Drawer/Content'
export { default as MinicartDrawerContentImage } from './deprecated/Minicart/Drawer/Content/Image'
export { default as MinicartDrawerContentRemove } from './deprecated/Minicart/Drawer/Content/Remove'
export { default as MinicartDrawerContentQuantity } from './deprecated/Minicart/Drawer/Content/Quantity'
export { default as MinicartButton } from './deprecated/Minicart/Button'
export { default as MinicartButtonIcon } from './deprecated/Minicart/Button/Icon'
export { default as MinicartButtonBadge } from './deprecated/Minicart/Button/Badge'
export { default as minicartI18nPT } from './deprecated/Minicart/i18n/pt'
export { default as minicartI18nEN } from './deprecated/Minicart/i18n/en'
export { minicartTheme } from './deprecated/Minicart/theme'

// Search Suggestions
export { default as SearchSuggestions } from './deprecated/SearchSuggestions'
export { default as SearchSuggestionsContainer } from './deprecated/SearchSuggestions/Container'
export { searchSuggestionsTheme } from './deprecated/SearchSuggestions/theme'
export { default as searchSuggestionsI18nPT } from './deprecated/SearchSuggestions/i18n/pt'
export { default as searchSuggestionsI18nEN } from './deprecated/SearchSuggestions/i18n/en'
