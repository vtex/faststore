import { Link } from '@vtex/faststore-ui'

import menuRoutes from '../../../../customizations/src/myAccount/navigation'
import { USER_DETAILS_ROUTE } from '../../../../sdk/account/getMyAccountRoutes'

const ROUTES_ONLY_FOR_REPRESENTATIVE = [USER_DETAILS_ROUTE]

export const OrganizationDrawerBody = ({
  isRepresentative,
}: { isRepresentative: boolean }) => {
  const routes = isRepresentative
    ? menuRoutes
    : menuRoutes.filter(
        ({ route }) => !ROUTES_ONLY_FOR_REPRESENTATIVE.includes(route)
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
