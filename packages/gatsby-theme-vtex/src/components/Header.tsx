/** @jsx jsx */
import { FC } from 'react'
import { Flex, jsx } from 'theme-ui'

import Logo from './Logo'
import Search from './Search'
import Minicart from './Minicart'
import Menu from './Menu'

const Header: FC = () => (
  <Flex variant="header" as="header">
    <Logo />
    <Menu />
    <Search />
    <Minicart />
  </Flex>
)

export default Header
