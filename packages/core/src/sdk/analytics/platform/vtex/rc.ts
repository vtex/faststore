import { AnalyticsEvent, PageViewEvent } from '@faststore/sdk'
import { ServerProductQueryQuery } from '@generated/graphql'
import {
  CategoryView,
  DepartmentView,
  HomeView,
  IntelligentSearchQueryEvent,
  InternalSiteSearchView,
  OtherView,
  ProductView,
  SearchEvents,
} from '../../types'

const EventNames = {
  OTHER_VIEW: 'otherView',
  HOME_VIEW: 'homeView',
  CATEGORY_VIEW: 'categoryView',
  DEPARTMENT_VIEW: 'departmentView',
  INTERNAL_SITE_SEARCH_VIEW: 'internalSiteSearchView',
  PRODUCT_VIEW: 'productView',
} as const

type RequestCaptureEventNames = (typeof EventNames)[keyof typeof EventNames]
type RequestCaptureEvent =
  | HomeView
  | CategoryView
  | DepartmentView
  | InternalSiteSearchView
  | ProductView
  | OtherView

const sendEvent = (
  eventName: RequestCaptureEventNames,
  eventParams: RequestCaptureEvent
) => {
  window?.sendrc?.(eventName, eventParams)
}

const handleEvent = (event: AnalyticsEvent | SearchEvents) => {
  let eventParams
  switch (event.name) {
    case 'page_view':
      eventParams = (event as PageViewEvent).params
      const pageType = eventParams?.page?.type ?? eventParams?.type

      switch (pageType) {
        case 'plp':
          if (!eventParams?.page_location?.includes('fuzzy')) {
            // Skip when there is no fuzzy parameters on the URL,
            // otherwise it'll be sent twice (once without fuzzy and once with fuzzy)
            break
          }
          const collection = eventParams?.data?.collection
          const collectionCategoryList =
            collection?.breadcrumbList?.itemListElement
          if (collectionCategoryList.length > 1) {
            sendEvent(EventNames.CATEGORY_VIEW, {
              departmentName: collectionCategoryList[0]?.name,
              categoryId: collection?.id,
              categoryName:
                collectionCategoryList[collectionCategoryList.length - 1]?.name,
            })
          } else {
            sendEvent(EventNames.DEPARTMENT_VIEW, {
              departmentId: collection?.id,
              departmentName: collectionCategoryList[0]?.name,
            })
          }

          break

        case 'pdp':
          const product = eventParams?.data
            ?.product as ServerProductQueryQuery['product']
          const productCategoryList = product?.breadcrumbList?.itemListElement
          const offers = product?.offers?.offers
          const sellerIds = offers.map((offer) => offer.seller.identifier)
          const skusOutOfStock = offers.filter(
            (offer) => offer.availability === 'https://schema.org/OutOfStock'
          )

          sendEvent(EventNames.PRODUCT_VIEW, {
            skuStockOutFromProductDetail: skusOutOfStock,
            productId: product?.isVariantOf?.productGroupID,
            productName: product?.isVariantOf?.name,
            productBrandName: product?.brand?.name,
            productDepartmentName: productCategoryList
              ? productCategoryList[0]?.name
              : '',
            productCategoryName:
              productCategoryList.length > 1
                ? productCategoryList[productCategoryList.length - 2]?.name
                : '',
            productPrice: offers[0]?.price,
            productListPrice: offers[0]?.listPrice,
            sellerId: offers[0]?.seller?.identifier,
            sellerIds: sellerIds.join(','),
          })
          break

        case 'home':
          sendEvent(EventNames.HOME_VIEW, {})
          break

        case 'search':
          // This one is skipped because the event related to search view is being
          // sent using the intelligent_search_query event due to its parameters
          break

        default:
          sendEvent(EventNames.OTHER_VIEW, {})
      }
      break

    case 'intelligent_search_query':
      eventParams = (event as IntelligentSearchQueryEvent).params
      sendEvent(EventNames.INTERNAL_SITE_SEARCH_VIEW, {
        siteSearchTerm: eventParams.term,
        siteSearchForm: eventParams.url,
        siteSearchResults: eventParams.totalCount,
      })
      break

    default:
  }
}

export default handleEvent
