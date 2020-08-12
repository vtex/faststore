import { Box, Flex, Link as LinkUI } from '@vtex/store-ui'
import { Link } from 'gatsby'
import React, { FC } from 'react'

const StoreHeaderOverMenu: FC<{ variant?: string }> = ({ variant }) => (
  <Box variant={variant}>
    <Flex>
      <Link className="first" to="/">
        Shop
      </Link>
      <Link to="/about">About us</Link>
    </Flex>
    <Flex>
      <LinkUI className="last" target="blank" href="https://vtex.com">
        visit vtex.com
      </LinkUI>
    </Flex>
  </Box>
)

export default StoreHeaderOverMenu
