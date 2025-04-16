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

const DEFAULT_ROUTES: Route[] = [
  {
    title: 'Profile',
    route: '/account/profile',
  },
  {
    title: 'Orders',
    route: '/account/orders',
  },
  {
    title: 'User Details',
    route: '/account/user-details',
  },
  {
    title: 'Security',
    route: '/account/security',
  },
]

export function getMyAccountRoutes({ routes }: GetMyAccountRouteParams) {
  return [...DEFAULT_ROUTES, ...routes]
}
