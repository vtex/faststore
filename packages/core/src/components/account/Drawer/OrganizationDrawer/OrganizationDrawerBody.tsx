import Link from 'src/components/ui/Link'

import menuRoutes from 'src/customizations/src/myAccount/navigation'
import { useAccountNavigationLabels } from 'src/sdk/account/accountPageContext'
import {
  ROUTES_ONLY_FOR_B2B_MEMBERS,
  USER_DETAILS_ROUTE,
  getExtraMyAccountRoutes,
  getMyAccountRoutes,
} from 'src/sdk/account/getMyAccountRoutes'

const ROUTES_ONLY_FOR_REPRESENTATIVE = [USER_DETAILS_ROUTE]

export const OrganizationDrawerBody = ({
  isRepresentative,
  isOrgMember,
}: {
  isRepresentative: boolean
  isOrgMember: boolean
}) => {
  const navigationLabels = useAccountNavigationLabels()

  const menuItems = getMyAccountRoutes({
    routes: getExtraMyAccountRoutes(menuRoutes),
    labels: navigationLabels,
  })

  const routes = (
    isRepresentative
      ? menuItems
      : menuItems.filter(
          ({ route }) => !ROUTES_ONLY_FOR_REPRESENTATIVE.includes(route)
        )
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
            href={route.route}
          >
            {route.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
