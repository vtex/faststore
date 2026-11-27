import { Link } from '@faststore/ui'

import menuRoutes from 'src/customizations/src/myAccount/navigation'
import { useAccountNavigationLabels } from 'src/sdk/account/accountPageContext'
import {
  ROUTES_ONLY_FOR_B2B_MEMBERS,
  USER_DETAILS_ROUTE,
  getExtraMyAccountRoutes,
  getMyAccountRoutes,
} from 'src/sdk/account/getMyAccountRoutes'
import { useLink } from 'src/sdk/ui/useLink'

const ROUTES_ONLY_FOR_B2B_BUYERS = new Set<string>([USER_DETAILS_ROUTE])

export const OrganizationDrawerBody = ({
  isB2BBuyer,
  isOrgMember,
}: {
  isB2BBuyer: boolean
  isOrgMember: boolean
}) => {
  const navigationLabels = useAccountNavigationLabels()
  const { resolveLink } = useLink()

  const menuItems = getMyAccountRoutes({
    routes: getExtraMyAccountRoutes(menuRoutes),
    labels: navigationLabels,
  })

  const routes = (
    isB2BBuyer
      ? menuItems
      : menuItems.filter(({ route }) => !ROUTES_ONLY_FOR_B2B_BUYERS.has(route))
  ).filter(
    ({ route }) => isOrgMember || !ROUTES_ONLY_FOR_B2B_MEMBERS.includes(route)
  )

  return (
    <div data-fs-organization-drawer-body>
      <div data-fs-organization-drawer-body-contents>
        {routes.map((route) => (
          <Link
            key={route.route}
            data-fs-organization-drawer-body-link
            href={resolveLink(route.route) ?? route.route}
          >
            {route.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
