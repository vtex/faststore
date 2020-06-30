/** @jsx jsx */
import { FC } from 'react'
import { Flex, jsx } from 'theme-ui'

import Logo from './Logo'
import Search from './Search'
import Minicart from './Minicart'
import Menu from './Menu'

const Header: FC = () => (
  <Flex
    as="header"
    bg="muted"
    px={[0, 2, 4]}
    py={3}
    sx={{
      justifyContent: ['center', 'space-between', 'space-between'],
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
    <Logo />
    <Menu />
    <Search />
    <Minicart />
  </Flex>
)

export default Header
