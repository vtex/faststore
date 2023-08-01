import React from 'react'
import {
  Link,
  Button,
  NavbarLinks,
  NavbarLinksList,
  NavbarLinksListItem,
} from '@faststore/ui'

function NavbarLinksUsage({ classes }: { classes?: string }) {
  const links = [
    'Office',
    'Home Appliances',
    'Computer and Software',
    'Technology',
  ]

  return (
    <NavbarLinks className={classes}>
      <div data-fs-navbar-links-wrapper data-fs-content="navbar">
        <Button variant="tertiary" size="small">
          Set location
        </Button>
        <NavbarLinksList>
          {links.map((link) => (
            <NavbarLinksListItem key={link}>
              <Link variant="display" href="#">
                {link}
              </Link>
            </NavbarLinksListItem>
          ))}
        </NavbarLinksList>
      </div>
    </NavbarLinks>
  )
}

export default NavbarLinksUsage
