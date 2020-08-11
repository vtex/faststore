import { Link } from 'gatsby'
import React, { FC } from 'react'
import { Flex } from '@vtex/store-ui'

const StoreHeaderMenu: FC<{ variant?: string }> = ({ variant }) => (
  <Flex as="nav" variant={variant}>
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

export default StoreHeaderMenu
