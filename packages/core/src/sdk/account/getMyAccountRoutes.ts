interface Route {
  /* Page name, displayed in the sidebar */
  title: string
  /* Accessible path within My Account */
  route: string
}

interface GetMyAccountRouteParams {
  /* Route list */
  routes: Route[]
}

export const USER_DETAILS_ROUTE = '/account/user-details'
export const ORDERS_ROUTE = '/account/orders'

// This is the default route list for My Account, we should add then as the feature is implemented
const DEFAULT_ROUTES: Route[] = [
  // {
  //   title: 'Profile',
  //   route: '/account/profile',
  // },
  {
    title: 'Orders',
    route: ORDERS_ROUTE,
  },
  {
    title: 'User Details',
    route: USER_DETAILS_ROUTE,
  },
  // {
  //   title: 'Security',
  //   route: '/account/security',
  // },
]

export function getMyAccountRoutes({ routes }: GetMyAccountRouteParams) {
  return [...DEFAULT_ROUTES, ...routes]
}
