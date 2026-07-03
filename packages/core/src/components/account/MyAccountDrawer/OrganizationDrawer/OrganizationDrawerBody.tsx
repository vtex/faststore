import { Link } from '@faststore/ui'

import menuRoutes from 'src/customizations/src/myAccount/navigation'
import {
  ROUTES_ONLY_FOR_B2B_MEMBERS,
  USER_DETAILS_ROUTE,
} from 'src/sdk/account/getMyAccountRoutes'

const ROUTES_ONLY_FOR_REPRESENTATIVE = [USER_DETAILS_ROUTE]

export const OrganizationDrawerBody = ({
  isRepresentative,
  isOrgMember,
}: {
  isRepresentative: boolean
  isOrgMember: boolean
}) => {
  const routes = (
    isRepresentative
      ? menuRoutes
      : menuRoutes.filter(
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
