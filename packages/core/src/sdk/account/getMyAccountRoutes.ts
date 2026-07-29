export interface Route {
  /* Page name, displayed in the sidebar */
  title: string
  /* Accessible path within My Account */
  route: string
}

export type AccountNavigationLabels = Partial<{
  profileLabel: string
  ordersLabel: string
  userDetailsLabel: string
  securityLabel: string
  manageLabel: string
  logoutLabel: string
  switchLabel: string
  companyLabel: string
  contractLabel: string
  cardsLabel: string
}>

interface GetMyAccountRouteParams {
  /* Route list */
  routes: Route[]
  labels?: AccountNavigationLabels
}

export const PROFILE_ROUTE = '/pvt/account/profile'
export const ORDERS_ROUTE = '/pvt/account/orders'
export const USER_DETAILS_ROUTE = '/pvt/account/user-details'
export const SECURITY_ROUTE = '/pvt/account/security'
export const CARDS_ROUTE = '/pvt/account/cards'

const ROUTE_LABEL_KEYS: Record<string, keyof AccountNavigationLabels> = {
  [PROFILE_ROUTE]: 'profileLabel',
  [ORDERS_ROUTE]: 'ordersLabel',
  [USER_DETAILS_ROUTE]: 'userDetailsLabel',
  [SECURITY_ROUTE]: 'securityLabel',
  [CARDS_ROUTE]: 'cardsLabel',
}

// This is the default route list for My Account, we should add then as the feature is implemented
const DEFAULT_ROUTES: Route[] = [
  {
    title: 'Profile',
    route: PROFILE_ROUTE,
  },
  {
    title: 'Orders',
    route: ORDERS_ROUTE,
  },
  {
    title: 'Cards',
    route: CARDS_ROUTE,
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

// Cards is gated by the `useAdHocCard` permission for Unit/Contract-affiliated
// buyers (spec US-4). Built fresh here — `main` has no B2B route-gating
// mechanism to reuse (see specs/my-account-cards.md, Decision 4).
export const ROUTES_REQUIRING_AD_HOC_CARD_ACCESS = [CARDS_ROUTE]

function withNavigationLabels(
  routes: Route[],
  labels?: AccountNavigationLabels
): Route[] {
  if (!labels) {
    return routes
  }

  return routes.map((item) => {
    const labelKey = ROUTE_LABEL_KEYS[item.route]
    const title = labelKey ? (labels[labelKey] ?? item.title) : item.title

    return { ...item, title }
  })
}

export function getMyAccountRoutes({
  routes,
  labels,
}: GetMyAccountRouteParams) {
  // Ensure all routes have the /pvt prefix
  const normalizedRoutes = routes.map(({ route, ...rest }) => ({
    ...rest,
    route: route.startsWith('/pvt') ? route : `/pvt${route}`,
  }))

  return withNavigationLabels([...DEFAULT_ROUTES, ...normalizedRoutes], labels)
}

export function getExtraMyAccountRoutes(routes: Route[]): Route[] {
  const defaultPaths = new Set(DEFAULT_ROUTES.map(({ route }) => route))

  return routes.filter(({ route }) => !defaultPaths.has(route))
}
