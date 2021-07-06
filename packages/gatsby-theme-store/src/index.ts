export { default as masterData } from './sdk/masterData'

export { useBuyButton } from './sdk/buyButton/useBuyButton'
export type { SKU } from './sdk/buyButton/useBuyButton'

export { useSalesChannel } from './sdk/channel/useSalesChannel'
export { useNewsletter } from './sdk/newsletter/useNewsletter'

// GraphQL API
export { useLazyQuery } from './sdk/graphql/useLazyQuery'
export { useQuery } from './sdk/graphql/useQuery'
export { useQueryInfinite } from './sdk/graphql/useQueryInfinite'

// TODO: We should have a single solution for dealing with images in our framework
export { optimize } from './sdk/img/fileManager'
export { useScaledImage } from './sdk/img/arquivos/useScaledImage'
export { scaleImage } from './sdk/img/arquivos/scale'

// Add third-party scripts API
export { useLazyScript } from './sdk/lazyScript/useLazyScript'

// Internationalization APIs
export { useCurrency } from './sdk/localization/useCurrency'
export { useLocale } from './sdk/localization/useLocale'
export { useNumberFormat } from './sdk/localization/useNumberFormat'

// Shipping
export { useShippingSimulator } from './sdk/shipping/useShippingSimulator'

export { useDiscount } from './sdk/offer/useDiscount'
export { useListPrice } from './sdk/offer/useListPrice'
export { usePrice } from './sdk/offer/usePrice'

export { useOrderForm, useOrderQueue } from './sdk/orderForm/useOrderForm'
export type { OrderForm } from './sdk/orderForm/Provider'
export { useOrderItems } from './sdk/orderForm/useOrderItems'
export { useOrderQueueStatus } from './sdk/orderForm/useQueueStatus'

export { useSummaryImage } from './sdk/product/useSummaryImage'
export { useSku } from './sdk/product/useSku'
export { useLink } from './sdk/product/useLink'
export { useDetailsVideos } from './sdk/product/useDetailsVideos'
export { useDetailsImages } from './sdk/product/useDetailsImages'
export { useBestSeller } from './sdk/product/useBestSeller'
export {
  SUMMARY_IMAGE,
  DETAILS_IMAGE,
  IMAGE_DEFAULT,
} from './sdk/product/constants'

export { useTopSearches } from './sdk/searchBar/useTopSearches'
export { useSuggestions } from './sdk/searchBar/useSuggestions'
export { useAutocompleteSuggestions } from './sdk/searchBar/useAutocompleteSuggestions'
export { useSearchHistory } from './sdk/searchBar/useSearchHistory'
export { useSearch } from './sdk/search/useSearch'
export { useFullTextSearch } from './sdk/searchBar/useFullTextSearch'
export { useQueryVariablesFromSearchParams } from './sdk/search/converter/useQueryVariablesFromSearchParams'
export { useSearchParamsFromUrl } from './sdk/search/converter/useSearchParamsFromURL'
export { usePersonalizedSearchRedirect } from './sdk/search/usePersonalizedSearchRedirect'

export { useProfile } from './sdk/session/useProfile'
export { useSession } from './sdk/session/useSession'

export { useSearchParams } from './sdk/state/useSearchParams'
export { usePersistedSearchParams } from './sdk/state/usePersistedSearchParams'
export { useRecommendationShelf } from './sdk/shelf/useRecommendationShelf'
export { useProductsShelf } from './sdk/shelf/useProductsShelf'
export type { ProductsShelfOptions } from './sdk/shelf/useProductsShelf'
export type { RecommendationOptions } from './sdk/shelf/useRecommendationShelf'

export { useRegion } from './sdk/region/useRegion'
export { setRegion } from './sdk/region/setRegion'

export { useToast } from './sdk/toast/useToast'

export { usePixelSendEvent } from './sdk/pixel/usePixelSendEvent'
export { usePixelEvent } from './sdk/pixel/usePixelEvent'
export type { PixelEvent } from './sdk/pixel/pixel'
export type { PixelEventHandler } from './sdk/pixel/usePixelEvent'
export * from './sdk/pixel/events'

export { once } from './sdk/once'

export { useBreadcrumbJsonLd as useProductBreadcrumbJsonLd } from './sdk/seo/product/useBreadcrumbJsonLd'
export type { Options as ProductBreadcrumbOptions } from './sdk/seo/product/useBreadcrumbJsonLd'

export { useMetadata as useProductMetadata } from './sdk/seo/product/useMetadata'
export type { Options as ProductMetadataOptions } from './sdk/seo/product/useMetadata'

export { useProductJsonLd } from './sdk/seo/product/useProductJsonLd'
export type { Options as ProductJsonLdOptions } from './sdk/seo/product/useProductJsonLd'

export { default as ProductSEO } from './components/Seo/product/ProductSEO'
export type { Props as ProductSEOProps } from './components/Seo/product/ProductSEO'

export { useProductPixel as useProductPixelEffect } from './sdk/product/useProductPixel'
export type { Options as ProductPixelOptions } from './sdk/product/useProductPixel'
export { default as RenderExtensionLoader } from './sdk/RenderExtensionLoader'

export { AUTH_PROVIDERS } from './components/Auth/Providers'
export { useProviders } from './sdk/auth/useProviders'
export { useOnLoginSuccessful } from './sdk/auth/useOnLoginSuccessful'
export type { ProvidersResponse } from './sdk/auth/Service/getProviders'
