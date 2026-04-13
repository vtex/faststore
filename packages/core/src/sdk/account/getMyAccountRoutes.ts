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

export const PROFILE_ROUTE = '/pvt/account/profile'
export const ORDERS_ROUTE = '/pvt/account/orders'
export const USER_DETAILS_ROUTE = '/pvt/account/user-details'
export const SECURITY_ROUTE = '/pvt/account/security'

// This is the default route list for My Account, we should add then as the feature is implemented
// Titles are react-intl message IDs, translated in MyAccountMenu
const DEFAULT_ROUTES: Route[] = [
  {
    title: 'myaccount.menu.profile',
    route: PROFILE_ROUTE,
  },
  {
    title: 'myaccount.menu.orders',
    route: ORDERS_ROUTE,
  },
  {
    title: 'myaccount.menu.userDetails',
    route: USER_DETAILS_ROUTE,
  },
  {
    title: 'myaccount.menu.security',
    route: SECURITY_ROUTE,
  },
]

export function getMyAccountRoutes({ routes }: GetMyAccountRouteParams) {
  // Ensure all routes have the /pvt prefix
  const normalizedRoutes = routes.map(({ route, ...rest }) => ({
    ...rest,
    route: route.startsWith('/pvt') ? route : `/pvt${route}`,
  }))

  return [...DEFAULT_ROUTES, ...normalizedRoutes]
}
