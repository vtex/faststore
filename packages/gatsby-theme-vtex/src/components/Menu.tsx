import { Link } from 'gatsby'
import React, { FC } from 'react'
import { Flex } from 'theme-ui'

const Menu: FC = () => (
  <Flex as="nav" variant="header-menu">
    <Link to="/apparel---accessories" activeClassName="active">
      Apparel
    </Link>
    <Link to="/electronics" activeClassName="active">
      Electronics
    </Link>
    <Link to="/about" activeClassName="active">
      About
    </Link>
  </Flex>
)

export default Menu
