import React from 'react'
import { List, Link, Button, NavbarLinks } from '@faststore/ui'

function NavbarLinksUsage({ classes }: { classes?: string }) {
  const links = [
    'Office',
    'Home Appliances',
    'Computer and Software',
    'Technology',
  ]

  return (
    <NavbarLinks className={`${classes}`}>
      <div className="layout__content">
        <Button variant="tertiary" size="small">
          Set location
        </Button>
        <List data-fs-navbar-links-list>
          {links.map((link) => (
            <li data-fs-navbar-links-list-item>
              <Link data-fs-navbar-links-link variant="display" href="#">
                {link}
              </Link>
            </li>
          ))}
        </List>
      </div>
    </NavbarLinks>
  )
}

export default NavbarLinksUsage
