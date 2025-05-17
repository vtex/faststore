import { Link } from '@faststore/ui'

import menuRoutes from 'src/customizations/src/myAccount/navigation'

export const OrganizationDrawerBody = () => {
  return (
    <>
      <div data-fs-organization-drawer-body>
        <div data-fs-organization-drawer-body-contents>
          {menuRoutes.map((route) => (
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
    </>
  )
}
