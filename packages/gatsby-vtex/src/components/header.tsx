import { Link } from 'gatsby'
import React from 'react'
import { Flex, Input, Styled } from 'theme-ui'

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
    <Link to="/">
      <Styled.img
        height="12px"
        src="https://storecomponents.vtexassets.com/arquivos/store-theme-logo.png"
      />
    </Link>
    <Input placeholder="Search" sx={{ maxWidth: 250, marginTop: [3, 0, 0] }} />
    <Minicart />
  </Flex>
)

export default Header
