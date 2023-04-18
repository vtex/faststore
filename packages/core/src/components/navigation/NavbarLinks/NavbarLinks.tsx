import type { AnchorHTMLAttributes } from 'react'

import type { NavbarLinksProps as UINavbarLinksProps } from '@faststore/ui'
import { List as UIList, NavbarLinks as UINavbarLinks } from '@faststore/ui'

import RegionButton from 'src/components/region/RegionButton'
import Link from 'src/components/ui/Link'
import { mark } from 'src/sdk/tests/mark'

export interface NavbarLinksProps extends UINavbarLinksProps {
  /**
   * Defines the classes to be applied.
   */
  classes?: string
  /**
   * Defines action to be performed when clicking on a link.
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

function NavbarLinks({ onClickLink, classes = '' }: NavbarLinksProps) {
  return (
    <UINavbarLinks className={`${classes}`}>
      <div className="layout__content">
        <RegionButton />
        <UIList data-fs-navbar-links-list>
          {collections.map(({ href, name }) => (
            <li key={name} data-fs-navbar-links-list-item>
              <Link
                data-fs-navbar-links-link
                variant="display"
                href={href}
                onClick={onClickLink}
              >
                {name}
              </Link>
            </li>
          ))}
        </UIList>
      </div>
    </UINavbarLinks>
  )
}

export default mark(NavbarLinks)
