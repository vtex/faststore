import type { AnchorHTMLAttributes } from 'react'

import type { NavbarLinksProps as UINavbarLinksProps } from '@faststore/ui'
import {
  NavbarLinks as UINavbarLinks,
  NavbarLinksList as UINavbarLinksList,
  NavbarLinksListItem as UINavbarLinksListItem,
} from '@faststore/ui'

import RegionButton from 'src/components/region/RegionButton'
import Link from 'src/components/ui/Link'
import { mark } from 'src/sdk/tests/mark'

export interface NavbarLinksProps extends UINavbarLinksProps {
  /**
   * Callback function when a link is clicked.
   */
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
}

const collections = [
  {
    name: 'Office',
    href: '/office',
  },
  {
    name: 'Home Appliances',
    href: '/kitchen---home-appliances',
  },
  {
    name: 'Computer and Software',
    href: '/computer---software',
  },
  {
    name: 'Technology',
    href: '/technology',
  },
]

function NavbarLinks({ onClickLink, ...otherProps }: NavbarLinksProps) {
  return (
    <UINavbarLinks {...otherProps}>
      <div className="layout__content">
        <RegionButton />
        <UINavbarLinksList>
          {collections.map(({ href, name }) => (
            <UINavbarLinksListItem key={name}>
              <Link variant="display" href={href} onClick={onClickLink}>
                {name}
              </Link>
            </UINavbarLinksListItem>
          ))}
        </UINavbarLinksList>
      </div>
    </UINavbarLinks>
  )
}

export default mark(NavbarLinks)
