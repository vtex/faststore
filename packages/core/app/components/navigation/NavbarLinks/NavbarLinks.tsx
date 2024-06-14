import type { AnchorHTMLAttributes } from 'react'

import type { NavbarLinksProps as UINavbarLinksProps } from '@faststore/ui'
import { NavbarLinksListItem as UINavbarLinksListItem } from '@faststore/ui'

import type { NavbarProps } from 'app/components/navigation/Navbar'
import Link from 'app/components/ui/Link'
import RegionButton from 'src/components/region/RegionButton'

import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { mark } from 'src/sdk/tests/mark'

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
  return (
    <NavbarLinksWrapper.Component {...otherProps} {...NavbarLinksWrapper.props}>
      <div data-fs-navbar-links-wrapper data-fs-content="navbar">
        {shouldDisplayRegion && (
          <RegionButton icon={regionIcon} label={regionLabel} />
        )}
        <NavbarLinksList.Component {...NavbarLinksList.props}>
          {links.map(({ url, text }) => (
            <UINavbarLinksListItem key={text}>
              <Link
                variant="display"
                href={url}
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

export default mark(NavbarLinks)
