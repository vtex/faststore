import type { AnchorHTMLAttributes } from 'react'
import { useRouter } from 'next/router'

import {
  NavbarLinksListItem as UINavbarLinksListItem,
  type NavbarLinksProps as UINavbarLinksProps,
} from '@faststore/ui'

import { deliveryPromise } from 'discovery.config'
import type { NavbarProps } from 'src/components/navigation/Navbar'
import RegionButton from 'src/components/region/RegionButton'
import RegionFilterButton from 'src/components/region/RegionFilterButton'
import Link from 'src/components/ui/Link'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { useSession } from 'src/sdk/session'
import { getRegionalizationSettings } from 'src/utils/globalSettings'

interface NavbarLinksProps extends UINavbarLinksProps {
  links: NavbarProps['links']
  region: NavbarProps['region']
  filterByStore: NavbarProps['filterByStore']
  /**
   * Callback function when a link is clicked.
   */
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
}

function NavbarLinks({
  links,
  onClickLink,
  region: { icon: regionIcon, label: regionLabel, shouldDisplayRegion },
  filterByStore: { label: filterByStoreLabel, icon: filterByStoreIcon },
  ...otherProps
}: NavbarLinksProps) {
  const { NavbarLinks: NavbarLinksWrapper, NavbarLinksList } =
    useOverrideComponents<'Navbar'>()
  const router = useRouter()
  const { postalCode } = useSession()
  const { filterByPickupPoint } = getRegionalizationSettings()

  const shouldDisplayGlobalFilter =
    deliveryPromise.enabled && !!postalCode && filterByPickupPoint?.enabled

  return (
    <NavbarLinksWrapper.Component {...otherProps} {...NavbarLinksWrapper.props}>
      <div data-fs-navbar-links-wrapper data-fs-content="navbar">
        {shouldDisplayRegion && (
          <RegionButton icon={regionIcon} label={regionLabel} />
        )}
        {shouldDisplayGlobalFilter && (
          <RegionFilterButton filterByPickupPoint={filterByPickupPoint} />
        )}
        <NavbarLinksList.Component {...NavbarLinksList.props}>
          {links.map(({ url, text }) => (
            <UINavbarLinksListItem key={text}>
              <Link
                variant="display"
                href={router.asPath.includes(url) ? '#' : url}
                prefetch={false}
                onClick={onClickLink}
              >
                {text}
              </Link>
            </UINavbarLinksListItem>
          ))}
        </NavbarLinksList.Component>
      </div>
    </NavbarLinksWrapper.Component>
  )
}

export default NavbarLinks
