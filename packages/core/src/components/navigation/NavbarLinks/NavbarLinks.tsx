import type { AnchorHTMLAttributes } from 'react'

import type { NavbarLinksProps as UINavbarLinksProps } from '@faststore/ui'
import { NavbarLinksListItem as UINavbarLinksListItem } from '@faststore/ui'

import type { NavbarProps } from 'src/components/navigation/Navbar'
import RegionButton from 'src/components/region/RegionButton'
import Link from 'src/components/ui/Link'

import {
  NavbarLinksList,
  NavbarLinks as NavbarLinksWrapper,
} from '@faststore/ui'

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
  // const { NavbarLinks: NavbarLinksWrapper, NavbarLinksList } =
  //   useOverrideComponents<'Navbar'>()
  return (
    <NavbarLinksWrapper {...otherProps}>
      <div data-fs-navbar-links-wrapper data-fs-content="navbar">
        {shouldDisplayRegion && (
          <RegionButton icon={regionIcon} label={regionLabel} />
        )}
        <NavbarLinksList>
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
        </NavbarLinksList>
      </div>
    </NavbarLinksWrapper>
  )
}

export default mark(NavbarLinks)
