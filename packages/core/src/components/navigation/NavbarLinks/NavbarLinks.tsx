import type { AnchorHTMLAttributes } from 'react'
import { useRouter } from 'next/router'

import {
  NavbarLinksListItem as UINavbarLinksListItem,
  type NavbarLinksProps as UINavbarLinksProps,
} from '@vtex/faststore-ui'

import type { NavbarProps } from '../Navbar'
import RegionButton from '../../region/RegionButton'
import RegionFilterButton from '../../region/RegionFilterButton'
import Link from '../../ui/Link'
import { useOverrideComponents } from '../../../sdk/overrides/OverrideContext'
import { useSession } from '../../../sdk/session'
import { useDeliveryPromise } from '../../../sdk/deliveryPromise'
import { getGlobalSettings } from '../../../utils/globalSettings'

interface NavbarLinksProps extends UINavbarLinksProps {
  links: NavbarProps['links']
  region: NavbarProps['region']
  /**
   * Callback function when a link is clicked.
   */
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
}

function NavbarLinks({
  links,
  onClickLink,
  region: { icon: regionIcon, label: regionLabel, shouldDisplayRegion },
  ...otherProps
}: NavbarLinksProps) {
  const { NavbarLinks: NavbarLinksWrapper, NavbarLinksList } =
    useOverrideComponents<'Navbar'>()
  const router = useRouter()
  const { postalCode } = useSession()
  const {
    deliveryPromise: { filterByPickupPoint } = {},
  } = getGlobalSettings()
  const { isEnabled: isDeliveryPromiseEnabled } = useDeliveryPromise()

  const shouldDisplayGlobalFilter =
    isDeliveryPromiseEnabled && !!postalCode && filterByPickupPoint?.enabled

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
