import { List as UIList } from '@faststore/ui'
import type { AnchorHTMLAttributes } from 'react'

import RegionButton from 'src/components/region/RegionButton'
import Link from 'src/components/ui/Link'
import { mark } from 'src/sdk/tests/mark'

interface NavLinksProps {
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
  classes?: string
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

function NavLinks({ onClickLink, classes = '' }: NavLinksProps) {
  return (
    <nav data-fs-navlinks className={`${classes}`}>
      <div className="layout__content">
        <RegionButton />
        <UIList data-fs-navlinks-list>
          {collections.map(({ href, name }) => (
            <li key={name} data-fs-navlinks-list-item>
              <Link
                data-fs-navlinks-link
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
    </nav>
  )
}

export default mark(NavLinks)
