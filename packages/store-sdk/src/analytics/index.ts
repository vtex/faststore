import type {
  ProductViewData,
  ProductClickData,
  ProductImpressionData,
  CategoryViewData,
  DepartmentViewData,
  InternalSiteSearchViewData,
  PageViewData,
  AddToCartData,
  CartLoadedData,
  UserData,
  RemoveFromCartData,
  OrderPlacedData,
} from './events'

export type AnalyticsEvent =
  | { type: 'vtex:productView'; data: ProductViewData }
  | { type: 'vtex:productClick'; data: ProductClickData }
  | { type: 'vtex:productImpression'; data: ProductImpressionData }
  | { type: 'vtex:categoryView'; data: CategoryViewData }
  | { type: 'vtex:departmentView'; data: DepartmentViewData }
  | { type: 'vtex:internalSiteSearchView'; data: InternalSiteSearchViewData }
  | { type: 'vtex:pageView'; data: PageViewData }
  | { type: 'vtex:cartLoaded'; data: CartLoadedData }
  | { type: 'vtex:addToCart'; data: AddToCartData }
  | { type: 'vtex:removeFromCart'; data: RemoveFromCartData }
  | { type: 'vtex:orderPlaced'; data: OrderPlacedData }
  | { type: 'vtex:otherView'; data: any }
  | { type: 'vtex:pageInfo'; data: any }
  | { type: 'vtex:cart'; data: any }
  | { type: 'vtex:checkout'; data: any }
  | { type: 'vtex:checkoutOption'; data: any }
  | { type: 'vtex:sendPayments'; data: any }
  | { type: 'vtex:finishPayment'; data: any }
  | { type: 'vtex:pageComponentInteraction'; data: any }
  | { type: 'vtex:installWebApp'; data: any }
  | { type: 'vtex:openDrawer'; data: any }
  | { type: 'vtex:userData'; data: UserData }

type WrappedAnalyticsEvent = { type: 'AnalyticsEvent'; data: AnalyticsEvent }

export const wrap = (event: AnalyticsEvent): WrappedAnalyticsEvent => ({
  type: 'AnalyticsEvent',
  data: event,
})

export const unwrap = (event: any) => {
  if (event.type === 'AnalyticsEvent') {
    return (event as WrappedAnalyticsEvent).data
  }

  return null
}
