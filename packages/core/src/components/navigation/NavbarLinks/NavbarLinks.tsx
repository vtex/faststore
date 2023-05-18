import type { AnchorHTMLAttributes } from 'react'

import {
  NavbarLinks as UINavbarLinks,
  NavbarLinksList as UINavbarLinksList,
  NavbarLinksListItem as UINavbarLinksListItem,
} from '@faststore/ui'
import type { NavbarLinksProps as UINavbarLinksProps } from '@faststore/ui'

import Link from 'src/components/ui/Link'
import RegionButton from 'src/components/region/RegionButton'
import type { NavbarProps } from 'src/components/navigation/Navbar'

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
  return (
    <UINavbarLinks {...otherProps}>
      <div className="layout__content">
        {shouldDisplayRegion && (
          <RegionButton icon={regionIcon} label={regionLabel} />
        )}
        <UINavbarLinksList>
          {links.map(({ url, text }) => (
            <UINavbarLinksListItem key={text}>
              <Link variant="display" href={url} onClick={onClickLink}>
                {text}
              </Link>
            </UINavbarLinksListItem>
          ))}
        </UINavbarLinksList>
      </div>
    </UINavbarLinks>
  )
}

export default mark(NavbarLinks)
