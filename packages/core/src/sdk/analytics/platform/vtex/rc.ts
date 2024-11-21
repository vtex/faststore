import { AnalyticsEvent, PageViewEvent } from '@faststore/sdk'
import {
  CategoryView,
  DepartmentView,
  HomeView,
  IntelligentSearchQueryEvent,
  InternalSiteSearchView,
  OtherView,
  ProductView,
  SearchSelectItemEvent,
} from '../../types'

const EventNames = {
  OTHER_VIEW: 'otherView',
  HOME_VIEW: 'homeView',
  CATEGORY_VIEW: 'categoryView',
  DEPARTMENT_VIEW: 'departmentView',
  INTERNAL_SITE_SEARCH_VIEW: 'internalSiteSearchView',
  PRODUCT_VIEW: 'productView',
} as const

type EventNames = (typeof EventNames)[keyof typeof EventNames]
type EventParams =
  | HomeView
  | CategoryView
  | DepartmentView
  | InternalSiteSearchView
  | ProductView
  | OtherView

const sendEvent = (eventName: EventNames, eventParams: EventParams) => {
  window?.sendrc?.(eventName, eventParams)
}

const handleEvent = (
  event: AnalyticsEvent | SearchSelectItemEvent | IntelligentSearchQueryEvent
) => {
  let eventParams
  switch (event.name) {
    //TODO: add missing events - eg 'add_to_cart' and 'view_cart'
    case 'page_view':
      eventParams = (event as PageViewEvent).params
      switch (eventParams.type) {
        case 'plp':
          const collection = eventParams?.data?.collection
          const collectionCategoryList =
            collection?.breadcrumbList?.itemListElement
          if (collectionCategoryList.length > 1) {
            // console.log('✨ Category View Event:', eventParams)
            sendEvent(EventNames.CATEGORY_VIEW, {
              //TODO: add missing arg - categoryId
              departmentId: collection?.id,
              departmentName: collectionCategoryList[0]?.name,
              categoryName:
                collectionCategoryList[collectionCategoryList.length - 1]?.name,
            })
          } else {
            // console.log('✨ Department View Event:', eventParams)
            sendEvent(EventNames.DEPARTMENT_VIEW, {
              departmentId: collection?.id,
              departmentName: collectionCategoryList[0]?.name,
            })
          }
          break
        case 'pdp':
          // console.log('✨ Product View Event: ', eventParams)
          const product = eventParams?.data?.product
          const offers = product?.offers
          const productCategoryList = product?.breadcrumbList?.itemListElement
          sendEvent(EventNames.PRODUCT_VIEW, {
            //TODO: add missing args - skuStockOutFromProductDetail, productReferenceId,
            // productEans, skuStocks, productBrandId, productDepartmentId,
            // productCategoryId, productListPrice, sellerIds
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
            productPrice: offers?.price,
            sellerId: offers?.seller?.id,
          })
          break
        default:
          if (eventParams?.page?.type === 'home') {
            // console.log('✨ Home View Event:', eventParams)
            sendEvent(EventNames.HOME_VIEW, {})
          } else {
            // console.log('✨ Other View Event:', eventParams)
            sendEvent(EventNames.OTHER_VIEW, {})
          }
      }
      break
    case 'intelligent_search_query':
      console.log('✨ Internal Site Search View Event:', event)
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
