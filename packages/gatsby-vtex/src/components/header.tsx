import React from 'react'
import { Flex } from 'theme-ui'

import Logo from './Logo'
import Search from './Search'
import Minicart from './Minicart'

const Header = () => (
  <Flex
    as="header"
    bg="muted"
    px={[2, 3, 4]}
    py={3}
    sx={{
      justifyContent: ['center', 'space-between', 'space-between'],
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
    <Logo />
    <Search />
    <Minicart />
  </Flex>
)

export default Header
