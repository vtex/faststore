/** @jsx jsx */
import { FC } from 'react'
import { Flex, jsx } from '@vtex/store-ui'

import Logo from './Logo'
import Search from './SearchBar'
import Minicart from './Minicart'
import Menu from './Menu'

const Header: FC = () => (
  <Flex variant="header" as="header">
    <Flex variant="header-left">
      <Logo />
      <Menu />
    </Flex>
    <Flex variant="header-right">
      <Search />
      <Minicart />
    </Flex>
  </Flex>
)

export default Header
