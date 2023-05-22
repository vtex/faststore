import type { AnchorHTMLAttributes } from 'react'

import { NavbarLinksListItem as UINavbarLinksListItem } from '@faststore/ui'
import type { NavbarLinksProps as UINavbarLinksProps } from '@faststore/ui'

import Link from 'src/components/ui/Link'
import type { NavbarProps } from 'src/components/navigation/Navbar'

import { mark } from 'src/sdk/tests/mark'

import { Components } from 'src/components/sections/Navbar/Overrides'

const {
  NavbarLinks: NavbarLinksWrapper,
  NavbarLinksList,
  RegionButton,
} = Components

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
    <NavbarLinksWrapper {...otherProps}>
      <div className="layout__content">
        {shouldDisplayRegion && (
          <RegionButton icon={regionIcon} label={regionLabel} />
        )}
        <NavbarLinksList>
          {links.map(({ url, text }) => (
            <UINavbarLinksListItem key={text}>
              <Link variant="display" href={url} onClick={onClickLink}>
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
