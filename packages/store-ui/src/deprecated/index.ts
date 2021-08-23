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
  Textarea as UITextarea,
  Text,
  Radio as UIRadio,
  Checkbox as UICheckbox,
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
  TextareaProps as UITextareaProps,
  TextProps,
  RadioProps as UIRadioProps,
  CheckboxProps as UICheckboxProps,
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

// The default Spinner from theme-ui, at the time of writing,
// is under-performant in terms of CPU usage
// https://github.com/vtex/faststore/pull/558
export { default as Spinner } from './Spinner'

// Exporting with different names not to conflict with our atom
export { Select as UISelect } from 'theme-ui'
export { SelectProps as UISelectProps } from 'theme-ui'

// Base components from @vtex-components
// Drawer
export { default as Drawer } from '@vtex-components/drawer'

// Utils
// Merge Theme
export { createTheme } from './createTheme'
// Base Theme
export { baseTheme } from './theme'

// throttle and debounce
export { default as throttle } from './utils/throttle'
export { default as debounce } from './utils/debounce'

// Local Components
// Header
export * from './Header'
export * from './Header/theme'
// Logo
export * from './Logo'
// ProgressiveLoader
export { default as ProgressiveImage } from './ProgressiveImage'
// ResponsivePicture
export { default as ResponsivePicture } from './ResponsivePicture'
export { default as responsivePictureTheme } from './ResponsivePicture/theme'
// InfoCard
export { default as InfoCard } from './InfoCard'
export { default as InfoCardImage } from './InfoCard/Image'
export { default as InfoCardInfo } from './InfoCard/Info'
export { default as InfoCardInfoAction } from './InfoCard/InfoAction'
export { default as infoCardTheme } from './InfoCard/theme'
// LocalizedLink
export { default as LocalizedLink } from './LocalizedLink'
// Banner
export { default as Banner } from './Banner'
// RichMarkdown
export { default as RichMarkdown } from './RichMarkdown'
// RichText
export { default as RichText } from './RichText'
// Search Filters
export {
  default as SearchFilterAccordion,
  SearchFilterItem,
} from './SearchFilter/Accordion'
export { default as SearchFilterAccordionItemCheckbox } from './SearchFilter/AccordionItemCheckbox'
export { default as SearchFilterAccordionItemSlider } from './SearchFilter/AccordionItemSlider'
export * from './SearchFilter/theme'
// Search Controls
export * from './SearchControls'
export * from './SearchControls/FiltersButton'
export * from './SearchControls/totalCount'
export * from './SearchControls/Select'
export * from './SearchControls/theme'
// Shelf
export { default as ShelfArrowLeft } from './Shelf/ArrowLeft'
export { default as ShelfArrowRight } from './Shelf/ArrowRight'
export { default as ShelfContainer } from './Shelf/Container'
export { default as ShelfPaginationDots } from './Shelf/PaginationDots'
export { default as ShelfTitle } from './Shelf/Title'
export { default as ShelfPage } from './Shelf/Page'
export { default as Shelf } from './Shelf'
export { default as shelfTheme } from './Shelf/theme'
// Breadcrumb
export * from './Breadcrumb'
export { default as breadcrumbTheme } from './Breadcrumb/theme'
// Slider
export { default as SliderPaginationDots } from './Slider/PaginationDots'
export { default as SliderArrowLeft } from './Slider/ArrowLeft'
export { default as SliderArrowRight } from './Slider/ArrowRight'
export {
  UseSliderOptions,
  useSlider as useUISlider,
} from './Slider/hooks/useSlider'
export * from './Slider/hooks/useResponsiveSlider'
// Centered
export { default as Center } from './Center'
// Product Specification
export * from './ProductSpecification'
// Product Description
export * from './ProductDescription'
// Product Quantity
export * from './ProductQuantity'
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
export { default as ProductDetailsTitle } from './ProductDetails/Title'
export { default as ProductDetailsGallery } from './ProductDetails/Gallery'
export { default as ProductDetailsReference } from './ProductDetails/Reference'
// Floating Action Button
export { default as FloatingActionButton } from './FloatingActionButton'
export { default as floatingActionButtonTheme } from './FloatingActionButton/theme'
// GiftList
export { default as GiftList } from './GiftList/index'
export { default as GiftListTitle } from './GiftList/Title'
export { default as GiftListList } from './GiftList/List'
// Skeleton
export { default as Skeleton } from './Skeleton'
// videoIframe
export { default as YoutubeIframe } from './Youtube/Iframe'
export { default as YoutubeThumb } from './Youtube/Thumb'
export * from './Youtube/hooks'
// Carousel
export { default as UICarousel } from './Carousel'
export { default as UICarouselPage } from './Carousel/Page'
export { default as UICarouselArrowLeft } from './Carousel/ArrowLeft'
export { default as UICarouselArrowRight } from './Carousel/ArrowRight'
export { default as UICarouselPaginationDots } from './Carousel/PaginationDots'

// ShippingSimulator
export { default as ShippingSimulator } from './ShippingSimulator'
export { default as shippingSimulatorI18nPT } from './ShippingSimulator/i18n/pt'
export { default as shippingSimulatorI18nEN } from './ShippingSimulator/i18n/en'

// Search Bar
export { default as SearchBar } from './SearchBar'
export { default as SearchBarButton } from './SearchBar/Button'
export { default as SearchBarContainer } from './SearchBar/Container'
export { default as SearchBarInput } from './SearchBar/Input'
export { default as searchBarTheme } from './SearchBar/theme'
export {
  default as SearchBarProvider,
  SearchBarContext,
} from './SearchBar/hooks/Provider'
export { useSearchBarContext } from './SearchBar/hooks/useSearchBarContext'
export type { ISearchContext } from './SearchBar/hooks/Provider'
// Login
export { default as LoginLogo } from './Login/Logo'
export { default as loginTheme } from './Login/theme'
// Dialog
export * from 'reakit/Dialog'
// Portal
export * from 'reakit/Portal'
// Tooltip
export * from 'reakit/Tooltip'

// Toast
export { default as Toast } from './Toast'
export { default as toastTheme } from './Toast/theme'

// Suspense
export { default as SuspenseDevice } from './Suspense/Device'
export { default as SuspenseSSR } from './Suspense/SSR'
export { default as SuspenseViewport } from './Suspense/Viewport'
export { useIdleEffect } from './Suspense/hooks/useIdleEffect'
export { useDevice } from './Suspense/hooks/useDevice'

// Product Image Gallery
export { default as ProductImageGallery } from './ProductImageGallery'
export { default as ProductImageGalleryArrowLeft } from './ProductImageGallery/ArrowLeft'
export { default as ProductImageGalleryArrowRight } from './ProductImageGallery/ArrowRight'
export { default as ProductImageGalleryPage } from './ProductImageGallery/Page'
export { default as ProductImageGalleryPaginationDots } from './ProductImageGallery/PaginationDots'
export { default as ProductImageGalleryMiniatures } from './ProductImageGallery/Miniatures'
export { default as ProductImageGalleryMiniaturesContainer } from './ProductImageGallery/Miniatures/Container'
export { productImageGalleryTheme } from './ProductImageGallery/theme'

// Minicart
export { default as MinicartDrawer } from './Minicart/Drawer'
export { default as MinicartDrawerHeader } from './Minicart/Drawer/Header'
export { default as MinicartDrawerHeaderCloseButton } from './Minicart/Drawer/Header/CloseButton'
export { default as MinicartDrawerFooter } from './Minicart/Drawer/Footer'
export { default as MinicartDrawerContent } from './Minicart/Drawer/Content'
export { default as MinicartDrawerContentImage } from './Minicart/Drawer/Content/Image'
export { default as MinicartDrawerContentRemove } from './Minicart/Drawer/Content/Remove'
export { default as MinicartDrawerContentQuantity } from './Minicart/Drawer/Content/Quantity'
export { default as MinicartButton } from './Minicart/Button'
export { default as MinicartButtonIcon } from './Minicart/Button/Icon'
export { default as MinicartButtonBadge } from './Minicart/Button/Badge'
export { default as minicartI18nPT } from './Minicart/i18n/pt'
export { default as minicartI18nEN } from './Minicart/i18n/en'
export { minicartTheme } from './Minicart/theme'

// Search Suggestions
export { default as SearchSuggestions } from './SearchSuggestions'
export { default as SearchSuggestionsContainer } from './SearchSuggestions/Container'
export { searchSuggestionsTheme } from './SearchSuggestions/theme'
export { default as searchSuggestionsI18nPT } from './SearchSuggestions/i18n/pt'
export { default as searchSuggestionsI18nEN } from './SearchSuggestions/i18n/en'

// Auth Providers
export { default as EmailAndPasswordProvider } from './Auth/Providers/EmailAndPassword'
export { default as EmailVerificationProvider } from './Auth/Providers/EmailVerification'
export { default as OAuthProvider } from './Auth/Providers/OAuth'
export { default as EmailAndPasswordButton } from './Auth/Providers/EmailAndPassword/Button'
export { default as EmailVerificationButton } from './Auth/Providers/EmailVerification/Button'
export { default as GoogleOAuthButton } from './Auth/Providers/Google/Button'
export { default as FacebookOAuthButton } from './Auth/Providers/Facebook/Button'
export { default as authProvidersTheme } from './Auth/Providers/theme'
export { default as authProvidersI18nPT } from './Auth/i18n/pt'
export { default as authProvidersI18nEN } from './Auth/i18n/en'
export type {
  AuthProviderComponentProps,
  AuthProviderButtonProps,
} from './Auth/Providers/types'
