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

export const USER_DETAILS_ROUTE = '/pvt/account/user-details'
export const ORDERS_ROUTE = '/pvt/account/orders'
export const SECURITY_ROUTE = '/pvt/account/security'

// This is the default route list for My Account, we should add then as the feature is implemented
const DEFAULT_ROUTES: Route[] = [
  {
    title: 'Profile',
    route: '/pvt/account/profile',
  },
  {
    title: 'Orders',
    route: ORDERS_ROUTE,
  },
  {
    title: 'User Details',
    route: USER_DETAILS_ROUTE,
  },
  {
    title: 'Security',
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
