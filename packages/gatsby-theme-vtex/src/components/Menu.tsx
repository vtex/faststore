import React, { FC } from 'react'
import { Flex, LocalizedLink } from '@vtex/store-ui'

const CustomMenu: FC<{ variant?: string }> = ({ variant }) => (
  <Flex as="nav" variant={variant}>
    <LocalizedLink to="/apparel---accessories" activeClassName="active">
      Apparel
    </LocalizedLink>
    <LocalizedLink to="/electronics" activeClassName="active">
      Electronics
    </LocalizedLink>
    <LocalizedLink to="/about" activeClassName="active">
      About
    </LocalizedLink>
  </Flex>
)

export default CustomMenu
